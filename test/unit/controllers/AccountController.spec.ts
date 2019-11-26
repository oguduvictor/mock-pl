import { AccountController } from '../../../src/controller/AccountController';
import { AccountService } from '../../../src/service/AccountService';
import { ILoginDto } from '../../../src/dto/ILoginDto';
import { IRegisterDto } from '../../../src/dto/IRegisterDto';
import { ITokenData } from '../../../src/dto/ITokenData';

describe('AccountController', () => {
	let accountController: AccountController;
	let accountService: jest.Mock<AccountService, any>;

	beforeAll(() => {
		accountService = jest.fn<AccountService, any>(
			() =>
				({
					login: async (loginDto: ILoginDto): Promise<ITokenData> =>
						({
							token: '',
							expiresIn: 90
						} as ITokenData),
					register: async (registerDto: IRegisterDto) =>
						({
							token: '',
							expiresIn: 90
						} as ITokenData)
				} as AccountService)
		);
	});

	beforeEach(() => {
		accountController = new AccountController(accountService());
	});

	it('Should be able to log user', async () => {
		const result = await accountController.login({
			email: 'victor@mail.com',
			password: '282828nsis'
		});

		expect(result).toBeTruthy();
	});

	it('Should be able to register user', async () => {
		const result = await accountController.register({
			email: 'victor@mail.com',
			password: '282828nsis',
			firstName: 'Victor',
			lastName: 'Ogudu'
		});

		expect(result).toBeTruthy();
	});
});
