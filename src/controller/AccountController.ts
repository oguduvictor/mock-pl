import { JsonController, Post, Body } from 'routing-controllers';
import { IRegisterDto } from '../dto/IRegisterDto';
import { ILoginDto } from '../dto/ILoginDto';
import { AccountService } from '../service/AccountService';

@JsonController('/account')
export class AccountController {
	constructor(private accountService: AccountService) {}

	@Post('/register')
	async register(@Body() payload: IRegisterDto) {
		return this.accountService.register(payload);
	}

	@Post('/login')
	async login(@Body() payload: ILoginDto) {
		return this.accountService.login(payload);
	}
}
