import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service } from 'typedi';
import { User } from '../entity/User';
import { Repository, DeleteResult } from 'typeorm';
import { IUser } from '../dto/IUser';
import { Mapper } from '../helpers/Mapper';
import { PasswordHasher } from '../helpers/PasswordHasher';
import { NotFoundError } from 'routing-controllers';

@Service()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	getAll = async (): Promise<IUser[]> => {
		const userEntities = await this.userRepository.find();

		return userEntities.map(userEntity => this.mapToDto(userEntity));
	};

	getOne = async (id: string): Promise<IUser> => {
		const userEntity = await this.userRepository.findOne(id);

		if (!userEntity) throw new NotFoundError();

		return this.mapToDto(userEntity);
	};

	save = async (user: IUser): Promise<IUser> => {
		const userEntity = Mapper.map<IUser, User>(user);

		userEntity.passwordHash = await PasswordHasher.hash(user.password);

		const savedUserEntity = await this.userRepository.save(userEntity);

		return this.mapToDto(savedUserEntity);
	};

	delete = async (id: string): Promise<DeleteResult> =>
		await this.userRepository.delete(id);

	private mapToDto = (entity: User): IUser =>
		({
			id: entity.id.toString(),
			firstName: entity.firstName,
			email: entity.email,
			role: entity.role,
			lastName: entity.lastName
		} as IUser);
}
