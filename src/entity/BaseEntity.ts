import { ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsDate } from 'class-validator';

export abstract class BaseEntity {
	@ObjectIdColumn({ primary: true, nullable: false })
	_id: string;

	@IsDate()
	@CreateDateColumn()
	created: Date;

	@IsDate()
	@UpdateDateColumn()
	modified: Date;
}
