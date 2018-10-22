import { Cart } from '../../entity/Cart';
import { User } from '../../entity/User';
import { AppResolverMap } from '../../typings';
import {
  AuthenticationError,
  ERROR_ALREADY_IN_CART,
  ERROR_EMPTY,
  ERROR_ITEM_NOT_FOUND
} from '../../utils/constants';
import { Product } from './../../entity/Product';

export const resolvers: AppResolverMap = {
  Query: {
    getCart: async (_, __, { db, session }) => {
      const { userId } = session;

      if (!userId) {
        throw new AuthenticationError();
      }
      const user = await db.getRepository(User).findOne(userId);

      return await db
        .getRepository(Cart)
        .find({ where: { user }, relations: ['product', 'user'] });
    }
  },
  Mutation: {
    addToCart: async (
      _,
      { productId, quantity }: GQL.IAddToCartOnMutationArguments,
      { db, session }
    ) => {
      const { userId } = session;

      if (!userId) {
        throw new AuthenticationError();
      }

      const product = await db.getRepository(Product).findOne(productId);
      const user = await db.getRepository(User).findOne(userId);
      if (!product) {
        throw new Error(ERROR_ITEM_NOT_FOUND);
      }

      const cartRepository = db.getRepository(Cart);

      const cart = await cartRepository.findOne({
        where: {
          product,
          user
        }
      });

      if (cart) {
        throw new Error(ERROR_ALREADY_IN_CART);
      }

      const c = cartRepository.create({
        product,
        user,
        title: product.title,
        quantity: quantity || 1
      });

      return await c.save();
    },

    removeFromCart: async (
      _,
      { productId }: GQL.IRemoveFromCartOnMutationArguments,
      { db, session }
    ) => {
      const { userId } = session;
      if (!userId) {
        throw new AuthenticationError();
      }

      const product = await db.getRepository(Product).findOne(productId);
      if (!product) {
        throw new Error(ERROR_ITEM_NOT_FOUND);
      }

      const user = await db.getRepository(User).findOne(userId);

      const cart = await db.getRepository(Cart).findOne({
        where: {
          product,
          user
        }
      });

      if (!cart) {
        throw new Error(ERROR_ITEM_NOT_FOUND);
      }

      return await db.getRepository(Cart).delete(cart.id);
    },

    emptyCart: async (_, __, { db, session }) => {
      const { userId } = session;

      if (!userId) {
        throw new AuthenticationError();
      }

      const user = await db.getRepository(User).findOne(userId);

      const cart = await db.getRepository(Cart).find({
        where: {
          user
        }
      });

      if (!cart.length) {
        throw new Error(ERROR_EMPTY);
      }

      const ids = cart.map(x => x.id);
      return await db.getRepository(Cart).delete(ids);
    }
  }
};
