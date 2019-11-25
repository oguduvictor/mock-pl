import {
	JsonController,
	Get,
	Post,
	Delete,
	Body,
	Param,
	Authorized,
	QueryParam
} from 'routing-controllers';
import { FixtureService } from '../service/FixtureService';
import { UserRole } from '../enums/UserRole';
import { FixtureStatus } from '../enums/FixtureStatus';
import { IFixture } from '../dto/IFixture';

@JsonController('/fixture')
export class FixtureController {
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
	async save(@Body() payload): Promise<IFixture> {
		return this.fixtureService.save(payload);
	}

	@Authorized(UserRole.ADMIN)
	@Delete('/:id')
	async remove(id): Promise<void> {
		await this.fixtureService.delete(id);
	}
}
