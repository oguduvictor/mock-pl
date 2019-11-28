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

	create = async (user: IUser): Promise<IUser> => {
		const { _id, password, ...userToCreate } = user;

		userToCreate['passwordHash'] = await PasswordHasher.hash(password);

		const savedUserEntity = await this.userRepository.save(
			userToCreate as User
		);

		return this.mapToDto(savedUserEntity);
	};

	update = async (id: string, user: IUser): Promise<IUser> => {
		const { _id, password, ...itemsToUpdate } = user;

		if (password)
			itemsToUpdate['passwordHash'] = await PasswordHasher.hash(password);

		await this.userRepository.update(id, itemsToUpdate);

		delete itemsToUpdate['passwordHash'];

		return itemsToUpdate as IUser;
	};

	delete = async (id: string): Promise<DeleteResult> =>
		this.userRepository.delete(id);

	private mapToDto = (entity: User): IUser =>
		entity == null
			? null
			: ({
					_id: entity._id.toString(),
					firstName: entity.firstName,
					email: entity.email,
					role: entity.role,
					lastName: entity.lastName
			  } as IUser);
}
