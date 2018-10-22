import * as IORedis from 'ioredis';
import slugify from 'slugify';
import { v4 } from 'uuid';
import { ValidationError } from 'yup';
import { GraphQLMiddlewareFunc, Resolver } from '../typings';
import {
  AuthenticationError,
  AuthorizationError,
  InputValidationError,
  REDIS_SESSION_PREFIX,
  TokenTypes,
  USER_SESSION_PREFIX
} from './constants';

export const makeSlug = (str: string) => slugify(str, { lower: true });

export const checkAdminRights = (session: any) => {
  const { userId, isAdmin } = session;
  if (!userId) {
    throw new AuthenticationError();
  }
  if (!isAdmin) {
    throw new AuthorizationError();
  }
};

export const validateInputs = async (schema: any, inputs: any) => {
  try {
    await schema.validate(inputs, { abortEarly: false });
  } catch (err) {
    const errors = formatYupError(err);
    throw new InputValidationError({
      data: errors
    });
  }
};

export const formatYupError = (err: ValidationError) => {
  const errors: [{ path: string; message: string }] = [] as any;
  err.inner.forEach(e => {
    errors.push({
      path: e.path,
      message: e.message
    });
  });
  return errors;
};

export const createMiddleware = (
  middlewareFunc: GraphQLMiddlewareFunc,
  resolverFunc: Resolver
) => (parent: any, args: any, context: any, info: any) =>
  middlewareFunc(resolverFunc, parent, args, context, info);

export const middleware = async (
  resolver: Resolver,
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  return resolver(parent, args, context, info);
};

export const createTokenLink = async (
  url: string,
  userId: string,
  redis: IORedis.Redis,
  type: TokenTypes
) => {
  const id = v4();
  await redis.set(id, userId, 'ex', 60 * 60 * 24);
  return `${url}/${type}/${id}`;
};

export const removeAllUsersSessions = async (
  userId: string,
  redis: IORedis.Redis
) => {
  const sessionIds = await redis.lrange(
    `${USER_SESSION_PREFIX}${userId}`,
    0,
    -1
  );

  const promises = [];
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < sessionIds.length; i += 1) {
    promises.push(redis.del(`${REDIS_SESSION_PREFIX}${sessionIds[i]}`));
  }
  await Promise.all(promises);
};
