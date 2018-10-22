import { rules } from '@gshop/common';
import { Category } from '../../entity/Category';
import { Product } from '../../entity/Product';
import { AppResolverMap } from '../../typings';
import { ERROR_INVALID_CATEGORY, ITEMS_PER_PAGE } from '../../utils/constants';
import { validateInputs } from './../../utils/utils';

export const resolvers: AppResolverMap = {
  Query: {
    listProducts: async (
      _,
      { page }: GQL.IListProductsOnQueryArguments,
      { db }
    ) => {
      const skip = page && page > 0 ? (page - 1) * ITEMS_PER_PAGE : 0;

      return await db.getRepository(Product).find({
        skip,
        take: ITEMS_PER_PAGE,
        relations: ['category']
      });
    },
    getProduct: async (_, { id }: GQL.IGetProductOnQueryArguments, { db }) => {
      return await db
        .getRepository(Product)
        .findOne(id, { relations: ['category'] });
    },
    getProductByCategory: async (
      _,
      { categoryId }: GQL.IGetProductByCategoryOnQueryArguments,
      { db }
    ) => {
      const category = await db.getRepository(Category).findOne(categoryId);
      if (!category) {
        throw new Error(ERROR_INVALID_CATEGORY);
      }

      return await db
        .getRepository(Product)
        .find({ where: { category }, relations: ['category'] });
    }
  },
  Mutation: {
    addProduct: async (_, args: GQL.IAddProductOnMutationArguments, { db }) => {
      await validateInputs(rules.productSchema, args);

      const {
        title,
        coverImage,
        rating,
        description,
        price,
        offerPrice,
        categoryId
      } = args;

      const category = await db.getRepository(Category).findOne(categoryId);

      if (!category) {
        throw new Error(ERROR_INVALID_CATEGORY);
      }

      const c = db.getRepository(Product).create({
        title,
        coverImage,
        rating,
        description,
        price,
        offerPrice,
        category
      });

      return await c.save();
    }
  }
};
