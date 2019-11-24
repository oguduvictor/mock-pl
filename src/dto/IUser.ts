import { UserRole } from '../enums/UserRole';
import { IBaseDto } from './IBaseDto';

export interface IUser extends IBaseDto {
	firstName: string;

	lastName: string;

	email: string;

	password: string;

	role: UserRole;
}
