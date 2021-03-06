import { IFixture } from '../../../src/dto/IFixture';
import { IUser } from '../../../src/dto/IUser';
import { ITeam } from '../../../src/dto/ITeam';
import { UserRole } from '../../../src/enums/UserRole';
import { FixtureStatus } from '../../../src/enums/FixtureStatus';

export const Users: IUser[] = [
	{
		_id: '1',
		email: 'victor@mail.com',
		password: 'pass@word1',
		firstName: 'Victor',
		lastName: 'Ogudu',
		role: UserRole.ADMIN
	},
	{
		_id: '2',
		email: 'john@mail.com',
		password: 'pass@word1',
		firstName: 'John',
		lastName: 'Doe',
		role: UserRole.USER
	},
	{
		_id: '3',
		email: 'jane@mail.com',
		password: 'pass@word1',
		firstName: 'Jane',
		lastName: 'Doe',
		role: UserRole.ADMIN
	}
] as IUser[];

export const Teams: ITeam[] = [
	{
		_id: '1',
		abbreviatedName: 'FCB',
		name: 'Barcelona'
	},
	{
		_id: '2',
		abbreviatedName: 'MCI',
		name: 'Manchester City'
	},
	{
		_id: '3',
		abbreviatedName: 'RMA',
		name: 'Real Madrid'
	},
	{
		_id: '4',
		abbreviatedName: 'LFC',
		name: 'Liverpool'
	},
	{
		_id: '5',
		abbreviatedName: 'ATM',
		name: 'Atletico Madrid'
	},
	{
		_id: '6',
		abbreviatedName: 'CFC',
		name: 'Chelsea'
	}
] as ITeam[];

export const Fixtures: IFixture[] = [
	{
		_id: '1',
		awayTeam: Teams[1],
		homeTeam: Teams[0],
		link: 'fcb - mci',
		matchDate: new Date(2019, 11, 12),
		status: FixtureStatus.PENDING
	},
	{
		_id: '2',
		awayTeam: Teams[2],
		homeTeam: Teams[3],
		link: 'rma - lfc',
		matchDate: new Date(2019, 9, 8),
		status: FixtureStatus.COMPLETED,
		homeTeamScore: 3,
		awayTeamScore: 4
	},
	{
		_id: '3',
		awayTeam: Teams[4],
		homeTeam: Teams[5],
		link: 'atm - cfc',
		matchDate: new Date(2019, 11, 26),
		status: FixtureStatus.INPROGRESS,
		homeTeamScore: 1,
		awayTeamScore: 1
	}
] as IFixture[];
