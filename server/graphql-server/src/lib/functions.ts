import {ErrorResponse} from '@sharedTypes/MessageTypes';
import jwt from 'jsonwebtoken';
import {MyContext, UserFromToken} from '../local-types';
import {Request} from 'express';

const fetchData = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  console.log('fetching data');
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok) {
    const errorJson = json as unknown as ErrorResponse;
    console.log('errorJson', errorJson);
    if (errorJson.message) {
      throw new Error(errorJson.message);
    }
    throw new Error(`Error ${response.status} occured`);
  }
  return json;
};

const authenticate = async (req: Request): Promise<MyContext> => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const user = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as UserFromToken;
      // add token to user object so we can use it in resolvers
      user.token = token;
      return {user};
    } catch (error) {
      console.log((error as Error).message);
      return {};
    }
  }
  return {};
};

export {fetchData, authenticate};
