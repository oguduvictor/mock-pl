import 'reflect-metadata';
import {
	createConnection,
	useContainer as typeormUseContainer,
	ConnectionOptions
} from 'typeorm';
import {
	useContainer as routingUseContainer,
	createExpressServer,
	getMetadataArgsStorage,
	Action,
	ForbiddenError,
	UnauthorizedError
} from 'routing-controllers';
import * as bodyParser from 'body-parser';
import { Container } from 'typedi';
import * as swaggerUi from 'swagger-ui-express';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { InfoObject } from 'openapi3-ts';
import * as redis from 'redis';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { User } from './entity/User';
import { JwtTokenHandler } from './helpers/JwtTokenHandler';
import ErrorMessage from './constants/ErrorMessage';
import Config from './config/Config';

// Dependency injection
typeormUseContainer(Container);
routingUseContainer(Container);

createConnection({ ...Config.ormConfig } as ConnectionOptions)
	.then(async connection => {
		const routingControllersOptions = {
			cors: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': '*',
				'Access-Control-Allow-Methods':
					'GET, PUT, POST, DELETE, OPTIONS'
			},
			routePrefix: '/api',
			controllers: [__dirname + '/controller/*.*s']
		};

		const app = createExpressServer({
			...routingControllersOptions,
			classTransformer: true,

			authorizationChecker: async (
				action: Action,
				roles: string[] = []
			) => {
				// here you can use request/response objects from action
				// also if decorator defines roles it needs to access the action
				// you can use them to provide granular access check
				// checker must return either boolean (true or false)
				// either promise that resolves a boolean value
				// demo code:

				if (!Array.isArray(roles)) {
					roles = [roles];
				}

				const authHeader: string =
					action.request.headers['authorization'] || '';

				if (!authHeader.startsWith('Bearer '))
					throw new UnauthorizedError('Unauthorized Access');

				const token = authHeader.substring(7);

				if (!token) throw new UnauthorizedError('Unauthorized Access');

				try {
					const decodedToken = JwtTokenHandler.validateToken(token);

					const user = await connection
						.getRepository(User)
						.findOne(decodedToken['userId']);

					if (user && !roles.some(role => user.role == role)) {
						const { stack, ...restError } = new ForbiddenError(
							ErrorMessage.USER_FORBIDDEN
						);

						action.response.status(403).json(restError);

						return false;
					}
				} catch (error) {
					action.response
						.status(401)
						.json({ message: error.message });

					return false;
				}

				return true;
			}
		});

		// Generates swagger schema
		const swaggerJsonSpec = routingControllersToSpec(
			getMetadataArgsStorage() as any,
			routingControllersOptions,
			{
				info: {
					title: 'MPL Fixtures',
					description: 'Mock Premier League teams and fixtures API'
				} as InfoObject,
				bearerAuth: {
					scheme: 'bearer',
					type: 'http',
					in: 'header',
					format: 'Bearer {token}'
				}
			}
		);

		const client = redis.createClient({
			host: Config.redisHost,
			port: Config.redisPort
		});

		const RedisStore = connectRedis(session);

		// Registering Redis for jwt session management
		app.use(
			session({
				name: 'MPL Redis Session',
				store: new RedisStore({ client }),
				secret: '29+zml]ms9o2moj[11',
				resave: false,
				saveUninitialized: false,
				cookie: { secure: false }
			})
		);

		app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsonSpec));

		app.use(bodyParser.json());

		// 404 Error
		app.use(function(req, res, next) {
			return res
				.status(404)
				.send({ message: 'Route' + req.url + ' Not found.' });
		});

		// 500 - Any server error
		app.use(function(err, req, res, next) {
			return res.status(500).send({ error: err });
		});

		// start express server
		app.listen(3000);

		console.log(
			`Express server has started on port 3000. Open http://localhost:3000/api-docs to see swagger view`
		);
	})
	.catch(error => console.error(error));
