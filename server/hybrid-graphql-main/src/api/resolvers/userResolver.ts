import {User, UserWithNoPassword} from '@sharedTypes/DBTypes';
import {fetchData} from '../../lib/functions';
import {MyContext, UserFromToken} from '../../local-types';
import {GraphQLError} from 'graphql';

import jwt from 'jsonwebtoken';
import {
  AvailableResponse,
  LoginResponse,
  UserDeleteResponse,
  UserResponse,
} from '@sharedTypes/MessageTypes';

export default {
  MediaItem: {
    owner: async (parent: {user_id: string}) => {
      const user = await fetchData<UserWithNoPassword>(
        process.env.AUTH_SERVER + '/users/' + parent.user_id,
      );
      return user;
    },
  },
  Like: {
    user: async (parent: {user_id: string}) => {
      const user = await fetchData<UserWithNoPassword>(
        process.env.AUTH_SERVER + '/users/' + parent.user_id,
      );
      return user;
    },
  },
  Rating: {
    user: async (parent: {user_id: string}) => {
      const user = await fetchData<UserWithNoPassword>(
        process.env.AUTH_SERVER + '/users/' + parent.user_id,
      );
      return user;
    },
  },
  Comment: {
    user: async (parent: {user_id: string}) => {
      const user = await fetchData<UserWithNoPassword>(
        process.env.AUTH_SERVER + '/users/' + parent.user_id,
      );
      return user;
    },
  },
  Query: {
    users: async () => {
      const users = await fetchData<UserWithNoPassword[]>(
        process.env.AUTH_SERVER + '/users',
      );
      return users;
    },
    user: async (_parent: undefined, args: {user_id: string}) => {
      const user = await fetchData<UserWithNoPassword>(
        process.env.AUTH_SERVER + '/users/' + args.user_id,
      );
      return user;
    },
    checkToken: async (
      _parent: undefined,
      _args: undefined,
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const options = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + context.user.token,
        },
      };
      const user = await fetchData<UserResponse>(
        process.env.AUTH_SERVER + '/users/token',
        options,
      );
      console.log(user);
      if (user.message === 'Token not valid') {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return user.user;
    },
    checkEmail: async (_parent: undefined, args: {email: string}) => {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const user = await fetchData<AvailableResponse>(
        process.env.AUTH_SERVER + '/users/email/' + args.email,
        options,
      );
      return user;
    },
    checkUsername: async (_parent: undefined, args: {username: string}) => {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const user = await fetchData<AvailableResponse>(
        process.env.AUTH_SERVER + '/users/username/' + args.username,
        options,
      );
      return user;
    },
  },
  Mutation: {
    register: async (
      _parent: undefined,
      args: {input: Pick<User, 'username' | 'password' | 'email'>},
    ) => {
      const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(args.input),
      };
      const userResponse = await fetchData<UserResponse>(
        process.env.AUTH_SERVER + '/users',
        options,
      );
      return userResponse.user;
    },
    updateUser: async (
      _parent: undefined,
      args: {
        input: Pick<User, 'username' | 'password' | 'email'>;
      },
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + context.user.token,
        },

        body: JSON.stringify(args.input),
      };
      const user = await fetchData<UserWithNoPassword>(
        process.env.AUTH_SERVER + '/users/',
        options,
      );
      return user;
    },
    deleteUser: async (
      _parent: undefined,
      _args: undefined,
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + context.user.token,
        },
      };
      const user = await fetchData<UserDeleteResponse>(
        process.env.AUTH_SERVER + '/users',
        options,
      );
      return user;
    },
    login: async (
      _parent: undefined,
      args: Pick<User, 'username' | 'password'>,
    ) => {
      const loginResponse = await fetchData<LoginResponse>(
        process.env.AUTH_SERVER + '/auth/login',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(args),
        },
      );
      console.log(loginResponse);
      const user = jwt.verify(
        loginResponse.token,
        process.env.JWT_SECRET as string,
      ) as UserFromToken;
      console.log('token check', user);
      return loginResponse;
    },
  },
};
