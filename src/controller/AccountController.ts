import { JsonController, Post, Body, Res, Req } from 'routing-controllers';
import { IRegisterDto } from '../dto/IRegisterDto';
import { ILoginDto } from '../dto/ILoginDto';
import { AccountService } from '../service/AccountService';
import { Request, Response } from 'express';

@JsonController('/account')
export class AccountController {
	constructor(private accountService: AccountService) {}

	@Post('/register')
	async register(@Body() payload: IRegisterDto, @Req() req: Request) {
		return this.accountService.register(payload, req);
	}

	@Post('/login')
	async login(@Body() payload: ILoginDto, @Res() req: Request) {
		return this.accountService.login(payload, req);
	}

	@Post('/logout')
	async logout(@Req() req: Request, @Res() res: Response) {
		req.session.destroy(() =>
			res.json({ message: 'Logged out successfully' })
		);
	}
}
