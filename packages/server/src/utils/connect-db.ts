// tslint:disable-next-line:no-var-requires
const iconv = require('iconv-lite');
// tslint:disable-next-line:no-var-requires
const encodings = require('iconv-lite/encodings');
iconv.encodings = encodings;

import { ConnectionOptions, createConnection } from 'typeorm';

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_TYPE,
  DB_NAME_TEST,
  ROOT_USER,
  ROOT_PASS,
  DB_NAME_PRODUCTION
} = process.env;

export interface ConnectionList {
  [key: string]: any;
}

export const c: ConnectionList = {
  development: {
    name: 'development',
    type: DB_TYPE,
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    dropSchema: true,
    synchronize: true,
    logging: true,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber'
    }
  },
  test: {
    name: 'test',
    type: DB_TYPE,
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME_TEST,
    dropSchema: true,
    synchronize: true,
    logging: false,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber'
    }
  },
  production: {
    name: 'production',
    type: DB_TYPE,
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME_PRODUCTION,
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber'
    }
  },
  root: {
    name: 'root',
    type: DB_TYPE,
    host: DB_HOST,
    port: DB_PORT,
    username: ROOT_USER,
    password: ROOT_PASS
  }
};

export const connectDb = async () => {
  const connectionOptions = c[process.env.NODE_ENV as string];

  return createConnection({
    ...connectionOptions,
    name: 'default'
  });
};

export const connectDbTest = async (resetDB: boolean = false) => {
  const connectionOptions = c[process.env.NODE_ENV as string];

  return createConnection({
    ...connectionOptions,
    name: 'default',
    synchronize: resetDB,
    dropSchema: resetDB
  });
};
