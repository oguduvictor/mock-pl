import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import { Fixture } from '../entity/Fixture';
import { Service } from 'typedi';
import { FixtureStatus } from '../enums/FixtureStatus';
import { IFixture } from '../dto/IFixture';
import { ITeam } from '../dto/ITeam';
import { NotFoundError } from 'routing-controllers';

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
		let filterOptions: any = {
			where: { $and: [{}] },
			cache: true //60000 /*1 minute*/
		};

		if (team)
			filterOptions = {
				...filterOptions,
				where: {
					...filterOptions.where,
					$or: [
						{
							'awayTeam.name': new RegExp(team, 'gi')
						},
						{ 'awayTeam.abbreviatedName': new RegExp(team, 'gi') },
						{
							'homeTeam.name': new RegExp(team, 'gi')
						},
						{ 'homeTeam.abbreviatedName': new RegExp(team, 'gi') }
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
			toDate.setHours(24);

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
		const fixtureEntity = await this.fixtureRepository.findOne(id);

		if (!fixtureEntity) throw new NotFoundError();

		return this.mapToDto(fixtureEntity);
	};

	create = async (fixture: IFixture): Promise<IFixture> => {
		const { matchDate, ...others } = fixture;

		others['matchDate'] = new Date(matchDate);

		const savedFixtureEntity = await this.fixtureRepository.save(
			others as IFixture
		);

		return this.mapToDto(savedFixtureEntity);
	};

	update = async (id: string, fixture: IFixture): Promise<IFixture> => {
		const { _id, matchDate, ...itemsToUpdate } = fixture;

		itemsToUpdate['matchDate'] = new Date(matchDate);

		await this.fixtureRepository.update(id, itemsToUpdate);

		return itemsToUpdate as IFixture;
	};

	delete = async (id: string): Promise<any> =>
		await this.fixtureRepository.delete(id);

	private mapToDto = (entity: Fixture): IFixture =>
		entity == null
			? null
			: ({
					_id: entity._id.toString(),
					awayTeam: !entity.awayTeam
						? null
						: ({
								_id: entity.awayTeam._id.toString(),
								name: entity.awayTeam.name,
								abbreviatedName: entity.awayTeam.abbreviatedName
						  } as ITeam),
					awayTeamScore: entity.awayTeamScore,
					homeTeam: !entity.homeTeam
						? null
						: ({
								_id: entity.homeTeam._id.toString(),
								name: entity.homeTeam.name,
								abbreviatedName: entity.homeTeam.abbreviatedName
						  } as ITeam),
					homeTeamScore: entity.homeTeamScore,
					link: entity.link,
					matchDate: entity.matchDate,
					status: entity.status
			  } as IFixture);
}
