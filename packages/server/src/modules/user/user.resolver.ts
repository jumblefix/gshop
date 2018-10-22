import { rules } from '@gshop/common';
import * as bcryptjs from 'bcryptjs';
import { User } from '../../entity/User';
import { AppResolverMap } from '../../typings';
import {
  AuthenticationError,
  Env,
  ERROR_INVALID_LOGIN,
  ERROR_INVALID_TOKEN,
  ERROR_PASSWORDS_DONT_MATCH,
  ERROR_USER_NOT_FOUND,
  ITEMS_PER_PAGE,
  TokenTypes,
  USER_SESSION_PREFIX
} from '../../utils/constants';
import {
  checkAdminRights,
  createMiddleware,
  createTokenLink,
  middleware,
  validateInputs
} from '../../utils/utils';
import { removeAllUsersSessions } from './../../utils/utils';

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
  Mutation: {
    register: async (
      _,
      args: GQL.IRegisterOnMutationArguments,
      { db, url, redis, session }
    ) => {
      const { admin = false } = args;

      if (admin) {
        checkAdminRights(session);
      }

      await validateInputs(rules.userSchema, args);

      const { email, password: pass, name, mobile } = args;

      const userExists = await db
        .getRepository(User)
        .findOne({ where: { email } });
      if (userExists) {
        throw new Error(`${email} is already registered with us`);
      }

      const user = db.getRepository(User).create({
        name: name.trim(),
        email: email.trim(),
        password: pass,
        mobile: mobile && mobile.length > 0 ? mobile.trim() : '',
        isAdmin: !!admin
      });

      const userData = await user.save();

      const confirmLink = await createTokenLink(
        url,
        userData.id,
        redis,
        TokenTypes.confirm
      );

      console.log(confirmLink);

      const {
        id,
        email: emailAddress,
        name: uName,
        mobile: mobileNumber
      } = userData;

      session.userId = id;
      session.name = uName;
      session.email = emailAddress;
      session.mobile = mobileNumber;

      if (process.env.NODE_ENV !== Env.test) {
        // const subject = 'Confirm your email address';
        // const message = `
        // <p>Please click on the link below to confirm your email address.</p>
        // <div>${confirmLink}</div>
        // `;
        // const emailHtml = renderEmail({
        //   subject,
        //   message,
        // });
        // await sendEmail({
        //   subject,
        //   to: userData.email,
        //   text: subject,
        //   html: emailHtml,
        // });
      }

      return userData;
    },
    login: async (
      _,
      { email, password }: GQL.ILoginOnMutationArguments,
      { session, redis, req, db }
    ) => {
      const user = await db.getRepository(User).findOne({ where: { email } });
      if (!user) {
        throw new Error(ERROR_USER_NOT_FOUND);
      }

      const valid = await bcryptjs.compare(password, user.password);
      if (!valid) {
        throw new Error(ERROR_INVALID_LOGIN);
      }

      const { id, name, email: emailAddress, isAdmin } = user;
      session.userId = id;
      session.name = name;
      session.email = emailAddress;
      session.isAdmin = isAdmin;

      if (req.sessionID) {
        await redis.lpush(`${USER_SESSION_PREFIX}${user.id}`, req.sessionID);
      }

      return user;
    },
    logout: async (_, __, { session, redis }) => {
      const { userId } = session;
      if (userId) {
        removeAllUsersSessions(userId, redis);
        session.destroy(err => {
          if (err) {
            console.log(err);
          }
        });
      }
      return userId !== '';
    },
    resendVerifySignup: async (_, __, { redis, session, url }) => {
      const { userId } = session;

      if (!userId) {
        throw new AuthenticationError();
      }

      const confirmLink = await createTokenLink(
        url,
        userId,
        redis,
        TokenTypes.confirm
      );

      console.log(confirmLink);
      if (process.env.NODE_ENV !== Env.test) {
        // const subject = 'Confirm your email address';
        // const message = `
        // <p>Please click on the link below to confirm your email address.</p>
        // <div>${confirmLink}</div>
        // `;
        // const emailHtml = renderEmail({
        //   subject,
        //   message,
        // });
        // await sendEmail({
        //   subject,
        //   to: userData.email,
        //   text: subject,
        //   html: emailHtml,
        // });
      }
      return true;
    },
    sendResetPassword: async (_, { email }, { redis, db, url }) => {
      const user = await db.getRepository(User).findOne({
        where: {
          email
        }
      });

      if (!user) {
        throw new Error(ERROR_USER_NOT_FOUND);
      }

      const { id: userId } = user;

      const resetLink = await createTokenLink(
        url,
        userId,
        redis,
        TokenTypes.reset
      );

      console.log(resetLink);

      if (process.env.NODE_ENV !== Env.test) {
        // const subject = 'Confirm your email address';
        // const message = `
        // <p>Please click on the link below to confirm your email address.</p>
        // <div>${confirmLink}</div>
        // `;
        // const emailHtml = renderEmail({
        //   subject,
        //   message,
        // });
        // await sendEmail({
        //   subject,
        //   to: userData.email,
        //   text: subject,
        //   html: emailHtml,
        // });
      }
      return true;
    },
    verifyResetPassword: async (
      _,
      { token, password, confirmPassword },
      { redis, db }
    ) => {
      if (password !== confirmPassword) {
        throw new Error(ERROR_PASSWORDS_DONT_MATCH);
      }

      const userId = await redis.get(token);
      if (!userId) {
        throw new Error(ERROR_INVALID_TOKEN);
      }

      await redis.del(token);

      const user = await db.getRepository(User).findOne(userId);
      if (!user) {
        throw new Error(ERROR_USER_NOT_FOUND);
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      await db.getRepository(User).update(userId, { password: hashedPassword });
      // TODO send an alert email
      return user;
    },
    changePassword: async (
      _,
      { oldPassword, password }: GQL.IChangePasswordOnMutationArguments,
      { db, session }
    ) => {
      const { userId } = session;
      if (!userId) {
        throw new AuthenticationError();
      }

      const user = await db.getRepository(User).findOne(userId);
      if (!user) {
        throw new Error(ERROR_USER_NOT_FOUND);
      }

      const valid = await bcryptjs.compare(oldPassword, user.password);
      if (!valid) {
        throw new Error('Invalid old password');
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      await db.getRepository(User).update(userId, { password: hashedPassword });
      // TODO send an alert email
      return user;
    },
    changeEmail: async (
      _,
      { email }: GQL.IChangeEmailOnMutationArguments,
      { db, session }
    ) => {
      const { userId } = session;
      if (!userId) {
        throw new AuthenticationError();
      }

      const user = await db.getRepository(User).findOne(userId);
      if (!user) {
        throw new Error(ERROR_USER_NOT_FOUND);
      }

      if (user.email === email) {
        throw new Error('New email is same as old one');
      }

      await db.getRepository(User).update(userId, { email });

      const newUser = await db.getRepository(User).findOne(userId);

      // TODO send an alert email
      return newUser;
    }
  }
};
