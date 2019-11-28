import { FixturesController } from '../../../src/controller/FixturesController';
import { FixtureService } from '../../../src/service/FixtureService';
import { IFixture } from '../../../src/dto/IFixture';
import { DeleteResult } from 'typeorm';
import { Fixtures } from '../__mocks__/MockData';
import { FixtureStatus } from '../../../src/enums/FixtureStatus';

describe('FixtureController', () => {
	let fixtureController: FixturesController;
	let fixtureService: jest.Mock<FixtureService, any>;

	beforeAll(() => {
		fixtureService = jest.fn<FixtureService, any>(
			() =>
				({
					getAll: async (
						team?: string,
						link?: string,
						status?: FixtureStatus,
						matchDate?: Date,
						from?: Date,
						to?: Date
					): Promise<IFixture[]> =>
						Fixtures.filter(x => x._id == '1'),
					getOne: async (id: string): Promise<IFixture> =>
						Fixtures.find(x => x._id == id),
					create: async (fixture: IFixture): Promise<IFixture> =>
						fixture,
					update: async (
						id: string,
						fixture: IFixture
					): Promise<IFixture> => fixture,
					delete: async (id: string): Promise<any> => ({})
				} as FixtureService)
		);
	});

	beforeEach(() => {
		fixtureController = new FixturesController(fixtureService());
	});

	it('Should be able to search Fixtures by name', async () => {
		const result = await fixtureController.search('bar');

		expect(result).toHaveLength(1);
		expect(result[0].homeTeam.name).toBe(Fixtures[0].homeTeam.name);
		expect(result[0].homeTeam.abbreviatedName).toBe(
			Fixtures[0].homeTeam.abbreviatedName
		);
	});

	it('Should be able to get Fixtures by id', async () => {
		const result = await fixtureController.one('3');

		expect(result).toBeTruthy();

		expect(result._id).toBe('3');
		expect(result.link).toBe(Fixtures[2].link);
	});

	it('Should be able to create a Fixture', async () => {
		const result = await fixtureController.save(Fixtures[0]);

		expect(result).toBeTruthy();
		expect(result._id).toBe(Fixtures[0]._id);
	});

	it('Should be able to delete a Fixture', async () => {
		const result = await fixtureController.remove('1');

		expect(result).toBeTruthy();
	});
});
