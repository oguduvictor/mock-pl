import {
	JsonController,
	Get,
	Post,
	Delete,
	Body,
	Param,
	Authorized
} from 'routing-controllers';
import { UserService } from '../service/UserService';
import { IUser } from '../dto/IUser';
import { UserRole } from '../enums/UserRole';

@Authorized(UserRole.ADMIN)
@JsonController('/users')
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	async all(): Promise<IUser[]> {
		return this.userService.getAll();
	}

	@Get('/:id')
	async one(@Param('id') id: string): Promise<IUser> {
		return this.userService.getOne(id);
	}

	@Post()
	async save(@Body() payload: IUser): Promise<IUser> {
		return this.userService.save(payload);
	}

	@Delete('/:id')
	async remove(@Param('id') id: string): Promise<void> {
		await this.userService.delete(id);
	}
}
