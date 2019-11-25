import { UserRole } from '../enums/UserRole';
import { FixtureStatus } from '../enums/FixtureStatus';
import { User } from '../entity/User';
import { Team } from '../entity/Team';
import { Fixture } from '../entity/Fixture';
import { PasswordHasher } from '../helpers/PasswordHasher';

export const UsersSeed: User[] = [
	{
		email: 'victor@mail.com',
		passwordHash: PasswordHasher.hashSync('pass@word1'),
		firstName: 'Victor',
		lastName: 'Ogudu',
		role: UserRole.ADMIN
	},
	{
		email: 'john@mail.com',
		passwordHash: PasswordHasher.hashSync('pass@word1'),
		firstName: 'John',
		lastName: 'Doe',
		role: UserRole.USER
	},
	{
		email: 'jane@mail.com',
		passwordHash: PasswordHasher.hashSync('pass@word1'),
		firstName: 'Jane',
		lastName: 'Doe',
		role: UserRole.ADMIN
	}
] as User[];

export const TeamsSeed: Team[] = [
	{
		abbreviatedName: 'FCB',
		name: 'Barcelona'
	},
	{
		abbreviatedName: 'MCI',
		name: 'Manchester City'
	},
	{
		abbreviatedName: 'RMA',
		name: 'Real Madrid'
	},
	{
		abbreviatedName: 'LFC',
		name: 'Liverpool'
	},
	{
		abbreviatedName: 'ATM',
		name: 'Atletico Madrid'
	},
	{
		abbreviatedName: 'CFC',
		name: 'Chelsea'
	}
] as Team[];

export const FixturesSeed: Fixture[] = [
	{
		awayTeam: TeamsSeed[1],
		homeTeam: TeamsSeed[0],
		link: 'fcb - mci',
		matchDate: new Date(2019, 11, 12),
		status: FixtureStatus.PENDING
	},
	{
		awayTeam: TeamsSeed[2],
		homeTeam: TeamsSeed[3],
		link: 'rma - lfc',
		matchDate: new Date(2019, 9, 8),
		status: FixtureStatus.COMPLETED,
		homeTeamScore: 3,
		awayTeamScore: 4
	},
	{
		awayTeam: TeamsSeed[4],
		homeTeam: TeamsSeed[5],
		link: 'atm - cfc',
		matchDate: new Date(2019, 11, 26),
		status: FixtureStatus.INPROGRESS,
		homeTeamScore: 1,
		awayTeamScore: 1
	}
] as Fixture[];
