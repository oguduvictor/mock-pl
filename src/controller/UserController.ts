import {
	JsonController,
	Get,
	Post,
	Delete,
	Body,
	Param
} from 'routing-controllers';
import { UserService } from '../service/UserService';
import { IUser } from '../dto/IUser';

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
	async remove(id): Promise<void> {
		await this.userService.delete(id);
	}
}
