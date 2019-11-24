import {
	JsonController,
	Get,
	Post,
	Delete,
	Body,
	Param,
	Authorized
} from 'routing-controllers';
import { FixtureService } from '../service/FixtureService';
import { UserRole } from '../enums/UserRole';

@Authorized()
@JsonController('/fixture')
export class FixtureController {
	constructor(private fixtureService: FixtureService) {}

	@Authorized(UserRole.ADMIN)
	@Get()
	async all() {
		return this.fixtureService.getAll();
	}

	@Get('/:id')
	async one(@Param('id') id: string) {
		return this.fixtureService.getOne(id);
	}

	@Post()
	async save(@Body() payload) {
		return this.fixtureService.save(payload);
	}

	@Delete('/:id')
	async remove(id) {
		await this.fixtureService.delete(id);
	}
}
