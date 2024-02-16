import { UserWithLevel } from '@sharedTypes/DBTypes';

type UserFromToken = Pick<UserWithLevel, 'user_id' | 'level_name'> & {
  token?: string;
};

type MyContext = {
  user?: UserFromToken;
};

export type {MyContext, UserFromToken};
