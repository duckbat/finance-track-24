import {ErrorResponse} from '@sharedTypes/MessageTypes';
import jwt from 'jsonwebtoken';
import {MyContext, UserFromToken} from '../local-types';
import {Request} from 'express';
import { Token } from 'graphql';

const fetchData = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  console.log('fetching data from url: ', url);
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
    try {
      const token = authHeader.split(' ')[1];
      const user = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as UserFromToken;
      // or check if user is in the auth server database
      // console.log(token);
      // const user = await fetchData<UserResponse>(
      //   `${process.env.AUTH_SERVER}/users/token`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   },
      // );
      if (!user) {
        return {};
      }
      // add token to user object so we can use it in resolvers
      user.token = token;
      console.log('user from token', user);
      return {user};
    } catch (error) {
      return {};
    }
  }
  return {};
};

const makeQuery = async <T>(query:string, variables:T, token:string) => {
  const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
  };
  const body = {
      query,
      variables,
  };
  const options: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
  };
  return await fetchData(
      import.meta.env.VITE_GRAPHQL_API as string,
      options,
  );
};

export {fetchData, authenticate, makeQuery};
