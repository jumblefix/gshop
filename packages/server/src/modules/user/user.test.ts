import { graphql } from 'graphql';
import * as ioredis from 'ioredis';
import { Connection } from 'typeorm';
import { connectDbTest } from '../../utils/connect-db';
import { createDb } from '../../utils/create-db';
import { genSchema } from '../../utils/gen-schema';
import TestClient from '../../utils/test-client';

let ctx: any;
let redis: ioredis.Redis;

const client = new TestClient('', true);

let connection: Connection;

beforeAll(async () => {
  try {
    await createDb();
  } catch (error) {
    throw new Error(error);
  }
  connection = await connectDbTest(true);
  redis = new ioredis();
  ctx = { session: {}, db: connection, redis };
});

const testGQL = async (query: any, context: any) =>
  await graphql(genSchema(), query, null, context, {});

describe('user', () => {
  describe('me', () => {
    it('should return null if not logged in', async () => {
      const query: any = await client.me();
      expect(await testGQL(query, ctx)).toMatchSnapshot();
    });
  });
  describe('register', () => {
    it('should register', async () => {
      const invalidRegister: any = await client.register('', '', '');
      expect(await testGQL(invalidRegister, ctx)).toMatchSnapshot();

      const validRegister = await client.register(
        'name',
        'email@email.com',
        '123456'
      );
      const response: any = await testGQL(validRegister, ctx);
      expect(response.data.register.email).toMatchSnapshot();

      const duplicateEmail: any = await testGQL(validRegister, ctx);
      expect(duplicateEmail).toMatchSnapshot();
    });
  });
});
