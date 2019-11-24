import { Column, Entity, ManyToOne } from 'typeorm';
import { Team } from './Team';
import { FixtureStatus } from '../enums/FixtureStatus';
import { BaseEntity } from './BaseEntity';
import { IsDate } from 'class-validator';

@Entity()
export class Fixture extends BaseEntity {
	@Column({ nullable: false })
	@ManyToOne(type => Team)
	homeTeam: Team;

	@Column()
	homeTeamScore: number;

	@Column({ nullable: false })
	@ManyToOne(type => Team)
	awayTeam: Team;

	@Column()
	awayTeamScore: number;

	@Column({ unique: true })
	link: string;

	@IsDate()
	@Column()
	matchDate: Date;

	@Column({
		type: 'enum',
		enum: FixtureStatus,
		default: FixtureStatus.PENDING,
		nullable: false
	})
	status: FixtureStatus;
}
