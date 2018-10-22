import slugify from 'slugify';
import { ValidationError } from 'yup';
import { GraphQLMiddlewareFunc, Resolver } from '../typings';
import {
  AuthenticationError,
  AuthorizationError,
  InputValidationError
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
