import { UsersController } from '../../../src/controller/UsersController';
import { UserService } from '../../../src/service/UserService';
import { IUser } from '../../../src/dto/IUser';
import { Users } from '../__mocks__/MockData';

describe('UserController', () => {
	let userController: UsersController;
	let userService: jest.Mock<UserService, any>;

	beforeAll(() => {
		userService = jest.fn<UserService, any>(
			() =>
				({
					getAll: async (): Promise<IUser[]> => Users,
					getOne: async (id: string): Promise<IUser> =>
						Users.find(x => x._id == id),
					create: async (user: IUser): Promise<IUser> => user,
					update: async (id: string, user: IUser): Promise<IUser> =>
						user,
					delete: async (id: string): Promise<any> => ({})
				} as UserService)
		);
	});

	beforeEach(() => {
		userController = new UsersController(userService());
	});

	it('Should be able to get all users', async () => {
		const result = await userController.all();

		expect(result).toHaveLength(3);
	});

	it('Should be able to get Users by id', async () => {
		const result = await userController.one('3');

		expect(result).toBeTruthy();

		expect(result.email).toBe(Users[2].email);
	});

	it('Should be able to save a user', async () => {
		const result = await userController.create({
			email: 'jane@mail.com',
			password: 'pass@word1',
			firstName: 'Jane',
			lastName: 'Doe'
		} as IUser);

		expect(result).toBeTruthy();
		expect(result.email).toBe('jane@mail.com');
	});

	it('Should be able to update a User', async () => {
		const result = await userController.update('3', {
			email: 'jane@mail.com',
			password: 'pass@word1',
			firstName: 'Jane',
			lastName: 'Doe'
		} as IUser);

		expect(result).toBeTruthy();
		expect(result.firstName).toBe('Jane');
		expect(result.email).toBe('jane@mail.com');
	});

	it('Should be able to delete a User', async () => {
		const result = await userController.remove('1');

		expect(result).toBeTruthy();
	});
});
