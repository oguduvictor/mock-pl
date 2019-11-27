import { TeamsController } from '../../../src/controller/TeamsController';
import { TeamService } from '../../../src/service/TeamService';
import { ITeam } from '../../../src/dto/ITeam';
import { DeleteResult } from 'typeorm';
import { Teams } from '../__mocks__/MockData';

describe('TeamController', () => {
	let teamController: TeamsController;
	let teamService: jest.Mock<TeamService, any>;

	beforeAll(() => {
		teamService = jest.fn<TeamService, any>(
			() =>
				({
					getAll: async (name: string): Promise<ITeam[]> =>
						Teams.filter(x =>
							x.name.toLowerCase().includes(name.toLowerCase())
						) as ITeam[],
					getOne: async (id: string): Promise<ITeam> =>
						Teams.find(x => x.id == id),
					save: async (team: ITeam): Promise<ITeam> => team,
					delete: async (id: string): Promise<DeleteResult> => ({
						affected: 1,
						raw: ''
					})
				} as TeamService)
		);
	});

	beforeEach(() => {
		teamController = new TeamsController(teamService());
	});

	it('Should be able to search teams by name', async () => {
		const result = await teamController.search('bar');

		expect(result).toHaveLength(1);
		expect(result[0].name).toBe(Teams[0].name);
		expect(result[0].abbreviatedName).toBe(Teams[0].abbreviatedName);
	});

	it('Should be able to get teams by id', async () => {
		const result = await teamController.one('3');

		expect(result).toBeTruthy();

		expect(result.name).toBe(Teams[2].name);
		expect(result.abbreviatedName).toBe(Teams[2].abbreviatedName);
	});

	it('Should be able to create a team', async () => {
		const result = await teamController.create({
			name: 'Manchester',
			abbreviatedName: 'MAN'
		} as ITeam);

		expect(result).toBeTruthy();
		expect(result.name).toBe('Manchester');
		expect(result.abbreviatedName).toBe('MAN');
	});

	it('Should be able to save a team', async () => {
		const result = await teamController.update('2', {
			name: 'Manchester',
			abbreviatedName: 'MCU'
		} as ITeam);

		expect(result).toBeTruthy();
		expect(result.name).toBe('Manchester');
		expect(result.abbreviatedName).toBe('MCU');
	});

	it('Should be able to delete a team', async () => {
		const result = await teamController.remove('1');

		expect(result).toBeUndefined();
	});
});
