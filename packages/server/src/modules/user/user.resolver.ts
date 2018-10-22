import { User } from '../../entity/User';
import { AppResolverMap } from '../../typings';
import { ITEMS_PER_PAGE } from '../../utils/constants';
import {
  checkAdminRights,
  createMiddleware,
  middleware
} from '../../utils/utils';

export const resolvers: AppResolverMap = {
  Query: {
    me: createMiddleware(middleware, (_, __, { session, db }) => {
      return db.getRepository(User).findOne({ where: { id: session.userId } });
    }),

    getUser: async (_, { id }: GQL.IGetUserOnQueryArguments, { db }) => {
      return await db.getRepository(User).findOne(id);
    },

    listUsers: async (
      _,
      { isAdmin = false, page }: GQL.IListUsersOnQueryArguments,
      { db, session }
    ) => {
      checkAdminRights(session);

      const skip = page && page > 0 ? (page - 1) * ITEMS_PER_PAGE : 0;

      return await db.getRepository(User).find({
        skip,
        take: ITEMS_PER_PAGE,
        where: {
          isAdmin
        }
      });
    }
  },
  Mutation: {}
};
