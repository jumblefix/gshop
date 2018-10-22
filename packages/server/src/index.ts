// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();
import { ApolloServer, gql } from 'apollo-server-express';
import * as connectRedis from 'connect-redis';
import * as express from 'express';
import * as ExpressSession from 'express-session';
import * as helmet from 'helmet';
import * as IORedis from 'ioredis';
import { Connection } from 'typeorm';
import { connectDb } from './utils/connect-db';
import { Env, REDIS_SESSION_PREFIX } from './utils/constants';
import { createDb } from './utils/create-db';
import { genSchema } from './utils/gen-schema';

process.on('uncaughtException', e => console.log(e));

process.on('unhandledRejection', e => console.log(e));

export const redis = new IORedis();

const RedisStore = connectRedis(ExpressSession as any);

const startServer = async () => {
  if (process.env.NODE_ENV === Env.test) {
    await redis.flushall();
  }

  try {
    await createDb();
  } catch (error) {
    throw new Error(error);
  }

  let db: Connection;

  try {
    db = await connectDb();
  } catch (error) {
    throw new Error(error);
  }

  const server = new ApolloServer({
    schema: genSchema(),
    context: async ({ req }: any) => ({
      redis,
      url: `${req.protocol}://${req.get('host')}`,
      session: req.session,
      db,
      req
    })
  });

  const app = express();

  app.use(helmet());

  app.use(
    ExpressSession({
      store: new RedisStore({
        client: redis as any,
        prefix: REDIS_SESSION_PREFIX
      }),
      name: 'qid',
      secret: (process.env.SESSION_SECRET as string) || 'MySecret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        // secure: process.env.NODE_ENV === Env.production,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );

  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: 'http://localhost:3000'
    }
  });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 http://localhost:4000${server.graphqlPath}`)
  );

  process.on('beforeExit', () => db.close());
};

startServer();
