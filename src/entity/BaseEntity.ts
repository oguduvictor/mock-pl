import { ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsDate } from 'class-validator';

export abstract class BaseEntity {
	@ObjectIdColumn()
	id: string;

	@IsDate()
	@CreateDateColumn()
	created: Date;

	@IsDate()
	@UpdateDateColumn()
	modified: Date;
}
