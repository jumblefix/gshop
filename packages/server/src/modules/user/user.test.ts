import { graphql } from 'graphql';
import { Connection } from 'typeorm';
import { connectDbTest } from '../../utils/connect-db';
import { createDb } from '../../utils/create-db';
import { genSchema } from '../../utils/gen-schema';
import TestClient from '../../utils/test-client';

const client = new TestClient('', true);

let connection: Connection;

beforeAll(async () => {
  try {
    await createDb();
  } catch (error) {
    throw new Error(error);
  }
  connection = await connectDbTest(true);
});

describe('user', () => {
  describe('me', () => {
    it('should return null if not logged in', async () => {
      const ctx = { session: {}, db: connection };
      const query: any = await client.me();
      const result = await graphql(genSchema(), query, null, ctx, {});
      expect(result).toMatchSnapshot();
    });
  });
});
