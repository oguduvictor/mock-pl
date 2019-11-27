import { IBaseDto } from './IBaseDto';
import { ITeam } from './ITeam';
import { FixtureStatus } from '../enums/FixtureStatus';

export interface IFixture extends IBaseDto {
	homeTeam: ITeam;

	homeTeamScore?: number;

	awayTeam: ITeam;

	awayTeamScore?: number;

	link: string;

	matchDate: Date;

	status: FixtureStatus;
}
