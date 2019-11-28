import {
	JsonController,
	Get,
	Post,
	Delete,
	Body,
	Param,
	Authorized,
	QueryParam,
	Put
} from 'routing-controllers';
import { FixtureService } from '../service/FixtureService';
import { UserRole } from '../enums/UserRole';
import { FixtureStatus } from '../enums/FixtureStatus';
import { IFixture } from '../dto/IFixture';

@JsonController('/fixtures')
export class FixturesController {
	constructor(private fixtureService: FixtureService) {}

	@Get()
	async search(
		@QueryParam('team') team?: string,
		@QueryParam('link') link?: string,
		@QueryParam('status') status?: FixtureStatus,
		@QueryParam('matchDate') matchDate?: Date,
		@QueryParam('from') from?: Date,
		@QueryParam('to') to?: Date
	): Promise<IFixture[]> {
		return this.fixtureService.getAll(
			team,
			link,
			status,
			matchDate,
			from,
			to
		);
	}

	@Authorized([UserRole.ADMIN, UserRole.USER])
	@Get('/:id')
	async one(@Param('id') id: string): Promise<IFixture> {
		return this.fixtureService.getOne(id);
	}

	@Authorized(UserRole.ADMIN)
	@Post()
	async save(
		@Body({ required: true, validate: true }) payload: IFixture
	): Promise<IFixture> {
		return this.fixtureService.create(payload);
	}

	@Authorized(UserRole.ADMIN)
	@Put('/:id')
	async update(
		@Param('id') id: string,
		@Body({ required: true, validate: true }) payload: IFixture
	): Promise<IFixture> {
		return this.fixtureService.update(id, payload);
	}

	@Authorized(UserRole.ADMIN)
	@Delete('/:id')
	async remove(id: string): Promise<any> {
		return await this.fixtureService.delete(id);
	}
}
