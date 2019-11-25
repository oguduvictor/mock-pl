import * as bcrypt from 'bcrypt';

export class PasswordHasher {
	static hash = async (password: string): Promise<string> =>
		await bcrypt.hash(password, 10);

	static hashSync = (password: string): string =>
		bcrypt.hashSync(password, 10);

	static validatePassword = async (
		password: string,
		hashedPassword: string
	): Promise<boolean> => await bcrypt.compare(password, hashedPassword);
}
