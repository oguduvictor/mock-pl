import {
	JsonController,
	Get,
	Post,
	Delete,
	Body,
	Param,
	Authorized,
	Put,
	QueryParam
} from 'routing-controllers';
import { TeamService } from '../service/TeamService';
import { UserRole } from '../enums/UserRole';
import { ITeam } from '../dto/ITeam';

@JsonController('/teams')
export class TeamsController {
	constructor(private teamService: TeamService) {}

	@Get()
	async search(@QueryParam('name') name: string): Promise<ITeam[]> {
		return this.teamService.getAll(name);
	}

	@Authorized([UserRole.ADMIN, UserRole.USER])
	@Get('/:id')
	async one(@Param('id') id: string): Promise<ITeam> {
		return this.teamService.getOne(id);
	}

	@Authorized(UserRole.ADMIN)
	@Post()
	async create(@Body({ required: true }) payload: ITeam): Promise<ITeam> {
		payload.id = null;

		return this.teamService.save(payload);
	}

	@Authorized(UserRole.ADMIN)
	@Put('/:id')
	async update(
		@Param('id') id: string,
		@Body({ required: true }) payload: ITeam
	): Promise<ITeam> {
		payload.id = id;

		return this.teamService.save(payload);
	}

	@Authorized(UserRole.ADMIN)
	@Delete('/:id')
	async remove(@Param('id') id: string): Promise<void> {
		await this.teamService.delete(id);
	}
}
