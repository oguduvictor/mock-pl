import { InjectRepository } from 'typeorm-typedi-extensions';
import { Team } from '../entity/Team';
import { Repository, DeleteResult, Like, FindManyOptions } from 'typeorm';
import { Service } from 'typedi';
import { ITeam } from '../dto/ITeam';

@Service()
export class TeamService {
	constructor(
		@InjectRepository(Team)
		private teamRepository: Repository<Team>
	) {}

	getAll = async (name: string): Promise<ITeam[]> => {
		const teamEntities = await this.teamRepository.find({
			where: {
				$or: [
					{ name: new RegExp(name, 'gi') },
					{ abbreviatedName: new RegExp(name, 'gi') }
				]
			}
		});

		return teamEntities.map(teamEntity => this.mapToDto(teamEntity));
	};

	getOne = async (id: string): Promise<ITeam> => {
		const teamEntity = await this.teamRepository.findOne(id);

		return this.mapToDto(teamEntity);
	};

	save = async (team: ITeam): Promise<ITeam> => {
		const teamEntity = {
			name: team.name,
			abbreviatedName: team.abbreviatedName,
			id: team.id
		} as Team;

		const savedTeamEntity = await this.teamRepository.save(teamEntity);

		return this.mapToDto(savedTeamEntity);
	};

	delete = async (id: string): Promise<DeleteResult> =>
		await this.teamRepository.delete(id);

	private mapToDto = (entity: Team): ITeam =>
		({
			id: entity.id.toString(),
			abbreviatedName: entity.abbreviatedName,
			name: entity.name
		} as ITeam);
}
