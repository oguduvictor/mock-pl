import { InjectRepository } from 'typeorm-typedi-extensions';
import { Team } from '../entity/Team';
import { Repository, DeleteResult } from 'typeorm';
import { Service } from 'typedi';
import { ITeam } from '../dto/ITeam';

@Service()
export class TeamService {
	constructor(
		@InjectRepository(Team)
		private teamRepository: Repository<Team>
	) {}

	getAll = async (name: string): Promise<ITeam[]> => {
		let queryBuilder = this.teamRepository.createQueryBuilder('team');

		if (name)
			queryBuilder = queryBuilder.where('team.name = :name', {
				name: name
			});

		const teamEntities = await queryBuilder.getMany();

		return teamEntities.map(teamEntity => this.mapToDto(teamEntity));
	};

	getOne = async (id: string): Promise<ITeam> => {
		const teamEntity = await this.teamRepository.findOne(id);

		return this.mapToDto(teamEntity);
	};

	save = async (team: Team): Promise<ITeam> => {
		const teamEntity = await this.teamRepository.save(team);

		return this.mapToDto(teamEntity);
	};

	delete = async (id: string): Promise<DeleteResult> =>
		await this.teamRepository.delete(id);

	private mapToDto = (entity: Team): ITeam =>
		({
			id: entity.id,
			abbreviatedName: entity.abbreviatedName,
			name: entity.name
		} as ITeam);
}
