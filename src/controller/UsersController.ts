import {
	JsonController,
	Get,
	Post,
	Delete,
	Body,
	Param,
	Authorized,
	Put
} from 'routing-controllers';
import { UserService } from '../service/UserService';
import { IUser } from '../dto/IUser';
import { UserRole } from '../enums/UserRole';

@Authorized(UserRole.ADMIN)
@JsonController('/users')
export class UsersController {
	constructor(private userService: UserService) {}

	@Get()
	async all(): Promise<IUser[]> {
		return this.userService.getAll();
	}

	@Get('/:id')
	async one(@Param('id') id: string): Promise<IUser> {
		return this.userService.getOne(id);
	}

	@Put('/:id')
	async update(
		@Param('id') id: string,
		@Body({ required: true, validate: true }) payload: IUser
	): Promise<IUser> {
		return this.userService.update(id, payload);
	}

	@Post()
	async create(
		@Body({ required: true, validate: true }) payload: IUser
	): Promise<IUser> {
		return this.userService.create(payload);
	}

	@Delete('/:id')
	async remove(@Param('id') id: string): Promise<any> {
		return await this.userService.delete(id);
	}
}
