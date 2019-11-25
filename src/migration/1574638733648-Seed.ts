import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entity/User';
import { UsersSeed, TeamsSeed, FixturesSeed } from '../seed/SeedData';
import { Team } from '../entity/Team';
import { Fixture } from '../entity/Fixture';

export class Seed1574638733648 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.connection.getRepository(User).save(UsersSeed);
		await queryRunner.connection.getRepository(Team).save(TeamsSeed);
		await queryRunner.connection.getRepository(Fixture).save(FixturesSeed);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.connection
			.getRepository(Fixture)
			.remove(FixturesSeed);
		await queryRunner.connection.getRepository(Team).remove(TeamsSeed);
		await queryRunner.connection.getRepository(User).remove(UsersSeed);
	}
}
