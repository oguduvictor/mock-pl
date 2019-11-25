import { Entity, Column } from 'typeorm';
import { UserRole } from '../enums/UserRole';
import { BaseEntity } from './BaseEntity';
import { IsEmail, MinLength, IsJWT } from 'class-validator';

@Entity()
export class User extends BaseEntity {
	@MinLength(3)
	@Column({ nullable: false })
	firstName: string;

	@MinLength(3)
	@Column({ nullable: false })
	lastName: string;

	@IsEmail()
	@Column({ unique: true })
	email: string;

	@IsJWT()
	@Column({
		nullable: false,
		select: false
	})
	passwordHash: string;

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.USER,
		nullable: false
	})
	role: UserRole;
}
