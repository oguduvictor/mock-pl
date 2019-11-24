import { IUser } from '../dto/IUser';
import * as jwt from 'jsonwebtoken';
import Config from '../config/Config';

export class JwtTokenHandler {
	static getAccessToken = (payload: IUser | object): string =>
		jwt.sign(payload, Config.jwt.secretKey, {
			expiresIn: Config.jwt.expiresIn,
			issuer: Config.jwt.issuer,
			audience: Config.jwt.audience
		});

	static validateToken = (token: string): string | object =>
		jwt.verify(token, Config.jwt.secretKey, {
			audience: Config.jwt.audience,
			issuer: Config.jwt.issuer
		});
}
