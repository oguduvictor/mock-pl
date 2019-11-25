import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository, DeleteResult } from 'typeorm';
import { Fixture } from '../entity/Fixture';
import { Service } from 'typedi';
import { FixtureStatus } from '../enums/FixtureStatus';
import { IFixture } from '../dto/IFixture';
import { ITeam } from '../dto/ITeam';
import { Team } from '../entity/Team';

@Service()
export class FixtureService {
	constructor(
		@InjectRepository(Fixture)
		private fixtureRepository: Repository<Fixture>
	) {}

	getAll = async (
		team?: string,
		link?: string,
		status?: FixtureStatus,
		matchDate?: Date,
		from?: Date,
		to?: Date
	): Promise<IFixture[]> => {
		let filterOptions: any = { where: { $and: [{}] } };

		if (team)
			filterOptions = {
				...filterOptions,
				where: {
					...filterOptions.where,
					$or: [
						{
							'awayTeam.name': new RegExp(team, 'gi'),
							'awayTeam.abbreviatedName': new RegExp(team, 'gi')
						},
						{
							'homeTeam.name': new RegExp(team, 'gi'),
							'homeTeam.abbreviatedName': new RegExp(team, 'gi')
						}
					]
				}
			};

		if (link) {
			filterOptions = {
				...filterOptions,
				where: {
					...filterOptions.where,
					$and: [
						...filterOptions.where.$and,
						{ link: new RegExp(link, 'gi') }
					]
				}
			};
		}

		if (matchDate) {
			const fromDate = new Date(matchDate);
			fromDate.setHours(0, 0, 0);

			const toDate = new Date(matchDate);
			toDate.setHours(23, 59, 59);

			filterOptions = {
				...filterOptions,
				where: {
					...filterOptions.where,
					$and: [
						...filterOptions.where.$and,
						{
							matchDate: { $lte: toDate, $gte: fromDate }
						}
					]
				}
			};
		}

		if (from && to)
			filterOptions = {
				...filterOptions,
				where: {
					...filterOptions.where,
					$and: [
						...filterOptions.where.$and,
						{ matchDate: { $lte: to, $gte: from } }
					]
				}
			};

		if (status)
			filterOptions = {
				...filterOptions,
				where: {
					...filterOptions.where,
					$and: [
						...filterOptions.where.$and,
						{
							status: status
						}
					]
				}
			};

		const teamEntities = await this.fixtureRepository.find(filterOptions);

		return teamEntities.map(teamEntity => this.mapToDto(teamEntity));
	};

	getOne = async (id: string): Promise<IFixture> => {
		const teamEntity = await this.fixtureRepository.findOne(id);

		return this.mapToDto(teamEntity);
	};

	save = async (fixture: IFixture): Promise<IFixture> => {
		const fi = {
			id: fixture.id,
			awayTeam: fixture.awayTeam
				? ({
						id: fixture.awayTeam.id,
						abbreviatedName: fixture.awayTeam.abbreviatedName,
						name: fixture.awayTeam.name
				  } as Team)
				: null,
			awayTeamScore: fixture.awayTeamScore,
			homeTeam: fixture.homeTeam
				? ({
						id: fixture.homeTeam.id,
						abbreviatedName: fixture.homeTeam.abbreviatedName,
						name: fixture.homeTeam.name
				  } as Team)
				: null,
			homeTeamScore: fixture.homeTeamScore,
			link: fixture.link,
			matchDate: new Date(fixture.matchDate),
			status: fixture.status
		} as Fixture;
		const teamEntity = await this.fixtureRepository.save(fixture);

		return this.mapToDto(teamEntity);
	};

	delete = async (id: string): Promise<DeleteResult> =>
		await this.fixtureRepository.delete(id);

	private mapToDto = (entity: Fixture): IFixture =>
		({
			id: entity.id.toString(),
			awayTeam: !entity.awayTeam
				? null
				: ({
						id: entity.awayTeam.id.toString(),
						name: entity.awayTeam.name,
						abbreviatedName: entity.awayTeam.abbreviatedName
				  } as ITeam),
			awayTeamScore: entity.awayTeamScore,
			homeTeam: !entity.homeTeam
				? null
				: ({
						id: entity.homeTeam.id.toString(),
						name: entity.homeTeam.name,
						abbreviatedName: entity.homeTeam.abbreviatedName
				  } as ITeam),
			homeTeamScore: entity.homeTeamScore,
			link: entity.link,
			matchDate: entity.matchDate,
			status: entity.status
		} as IFixture);
}
