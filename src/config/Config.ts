import { ConnectionOptions } from 'typeorm';

namespace Config {
	export const jwt = {
		secretKey: process.env.JWT_SECRET || '53cr37jw7k3y',
		expiresIn: Number(process.env.JWT_EXPIRATION) || 60 * 60 * 60 * 60, // in seconds
		issuer: process.env.JWT_ISSUER || 'Mock Premier League',
		audience: process.env.JWT_AUDIENCE || 'http://localhost:3000'
	};

	export const ormConfig = {
		type: 'mongodb',
		host: process.env.MONGO_HOST || 'localhost',
		port: Number(process.env.MONGO_PORT) || 27017,
		username: process.env.MONGO_USER,
		password: process.env.MONGO_PASS,
		database: process.env.MONGO_DB || 'MPL',
		synchronize: true,
		logging: true,
		entities: ['src/entity/**/*.*s'],
		migrations: ['src/migration/**/*.*s'],
		subscribers: ['src/subscriber/**/*.*s'],
		cli: {
			entitiesDir: 'src/entity',
			migrationsDir: 'src/migration',
			subscribersDir: 'src/subscriber'
		},
		cache: {
			type: 'redis',
			options: {
				host: process.env.REDIS_HOST || 'localhost',
				port: process.env.REDIS_PORT || 6379,
				password: process.env.REDIS_PASS
			}
		}
	} as ConnectionOptions;

	export const redisHost = process.env.REDIS_HOST || 'localhost';
	export const redisPort = Number(process.env.REDIS_PORT) || 6379;
	export const redisPass = process.env.REDIS_PASS;

	export const appPort = process.env.PORT || 8080;
}

export default Config;
