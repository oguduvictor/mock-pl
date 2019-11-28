import { InjectRepository } from 'typeorm-typedi-extensions';
import { Team } from '../entity/Team';
import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { ITeam } from '../dto/ITeam';
import { NotFoundError } from 'routing-controllers';

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

		if (!teamEntity) throw new NotFoundError();

		return this.mapToDto(teamEntity);
	};

	create = async (team: ITeam): Promise<ITeam> => {
		const savedTeamEntity = await this.teamRepository.save(team as Team);

		return this.mapToDto(savedTeamEntity);
	};

	update = async (team: ITeam): Promise<ITeam> => {
		const { _id, ...itemsToUpdate } = team;

		await this.teamRepository.update(_id, itemsToUpdate);

		return team;
	};

	delete = async (id: string): Promise<Team> => {
		const teamEntity = await this.teamRepository.findOne(id);

		return await this.teamRepository.remove(teamEntity);
	};

	private mapToDto = (entity: Team): ITeam =>
		entity == null
			? null
			: ({
					_id: entity._id.toString(),
					abbreviatedName: entity.abbreviatedName,
					name: entity.name
			  } as ITeam);
}
