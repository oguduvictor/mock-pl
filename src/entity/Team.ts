import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { MinLength } from 'class-validator';

@Entity()
export class Team extends BaseEntity {
	@MinLength(3)
	@Column({ nullable: false, unique: true })
	name: string;

	@MinLength(3)
	@Column({ nullable: false, unique: true })
	abbreviatedName: string;
}
