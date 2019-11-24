import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../entity/User';
import { Repository } from 'typeorm';
import { ILoginDto } from '../dto/ILoginDto';
import { PasswordHasher } from '../helpers/PasswordHasher';
import ErrorMessage from '../constants/ErrorMessage';
import { JwtTokenHandler } from '../helpers/JwtTokenHandler';
import { IRegisterDto } from '../dto/IRegisterDto';
import { Service } from 'typedi';
import { BadRequestError } from 'routing-controllers';
import Config from '../config/Config';
import { Request } from 'express';
import { ITokenData } from '../dto/ITokenData';

@Service()
export class AccountService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	login = async (loginDto: ILoginDto, req: Request): Promise<ITokenData> => {
		const user = await this.userRepository.findOne({
			email: loginDto.email
		});

		if (!user) throw new BadRequestError(ErrorMessage.NO_USER);

		const isValid = await PasswordHasher.validatePassword(
			loginDto.password,
			user.passwordHash
		);

		if (!isValid)
			throw new BadRequestError(
				ErrorMessage.WRONG_EMAIL_PASSWORD_COMBINATION
			);

		req.session.user = {
			id: user.id,
			firstName: user.firstName,
			email: user.email,
			lastName: user.lastName
		};

		return {
			token: JwtTokenHandler.getAccessToken({
				userId: user.id.toString()
			}),
			expiresIn: Config.jwt.expiresIn
		} as ITokenData;
	};

	register = async (
		registerDto: IRegisterDto,
		req: Request
	): Promise<ITokenData> => {
		const user = {
			firstName: registerDto.firstName,
			lastName: registerDto.lastName,
			email: registerDto.email,
			passwordHash: await PasswordHasher.hash(registerDto.password)
		} as User;

		const savedUserEntity = await this.userRepository.save(user);

		req.session.user = {
			id: savedUserEntity.id,
			firstName: savedUserEntity.firstName,
			email: savedUserEntity.email,
			lastName: savedUserEntity.lastName
		};

		return {
			token: JwtTokenHandler.getAccessToken({
				userId: savedUserEntity.id.toString()
			}),
			expiresIn: Config.jwt.expiresIn
		} as ITokenData;
	};
}
