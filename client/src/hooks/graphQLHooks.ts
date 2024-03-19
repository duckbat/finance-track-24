import {useEffect, useState} from 'react';
import {
  Comment,
  Like,
  Transaction,
  TransactionWithOwner,
  User,
} from '../types/DBTypes';
import {fetchData, makeQuery} from '../lib/functions';
import {Credentials, GraphQLResponse} from '../types/LocalTypes';
import {
  LoginResponse,
  TransactionResponse,
  MessageResponse,
  UploadResponse,
  UserResponse,
} from '../types/MessageTypes';
import {useUpdateContext} from './ContextHooks';

const useTransaction = () => {
  const [transactionArray, setTransactionArray] = useState<TransactionWithOwner[]>([]);
  const {update} = useUpdateContext();

  const getTransaction = async () => {
    try {
      const query = `
      query Transactions {
        transactions {
          transaction_id
          user_id
          owner {
            username
            user_id
          }
          filename
          thumbnail
          filesize
          media_type
          title
          description
          created_at
        }
      }
    `;

      const result = await makeQuery<
        GraphQLResponse<{transactions: TransactionWithOwner[]}>,
        undefined
      >(query);
      setTransactionArray(result.data.transactions);
    } catch (error) {
      console.error('getTransaction failed', error);
    }
  };

  useEffect(() => {
    getTransaction();
  }, [update]);

  const postTransaction = async (
    file: UploadResponse,
    inputs: Record<string, string>,
    token: string,
  ) => {
    // TODO: create a suitable object for Transaction API,
    // the type is Transaction without transaction_id, user_id,
    // thumbnail and created_at. All those are generated by the API.
    const transactionpost: Omit<
      Transaction,
      'transaction_id' | 'user_id' | 'thumbnail' | 'created_at'
    > = {
      title: inputs.title,
      description: inputs.description,
      filename: file.data.filename,
      filesize: file.data.filesize,
      media_type: file.data.media_type,
    };

    // TODO: post the data to Transaction API and get the data as TransactionResponse
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionpost),
    };
    return await fetchData<TransactionResponse>(
      import.meta.env.UPLOAD_SERVER + '/transactionpost',
      options,
    );
  };

  const deleteTransaction = async (transaction_id: string, token: string) => {
    const query = `mutation DeleteTransaction($transactionId: ID!) {
      deleteTransaction(transaction_id: $transactionId) {
        message
      }
    }`;

    const variables = {transactionId: transaction_id};

    const deleteResult = await makeQuery<
      GraphQLResponse<{deleteTransaction: MessageResponse}>,
      {transactionId: string}
    >(query, variables, token);

    return deleteResult.data.deleteTransaction;
  };

  return {transactionArray, postTransaction, deleteTransaction};
};

const useUser = () => {
  // TODO: implement network functions for auth server user endpoints
  const getUserByToken = async (token: string) => {
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<UserResponse>(
      import.meta.env.VITE_AUTH_API + '/users/token/',
      options,
    );
  };

  const postUser = async (user: Record<string, string>) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };

    await fetchData<UserResponse>(
      import.meta.env.VITE_AUTH_API + '/users',
      options,
    );
  };

  const getUsernameAvailable = async (username: string) => {
    return await fetchData<{available: boolean}>(
      import.meta.env.VITE_AUTH_API + '/users/username/' + username,
    );
  };

  const getEmailAvailable = async (email: string) => {
    return await fetchData<{available: boolean}>(
      import.meta.env.VITE_AUTH_API + '/users/email/' + email,
    );
  };

  const getUserById = async (user_id: number) => {
    return await fetchData<User>(
      import.meta.env.VITE_AUTH_API + '/users/' + user_id,
    );
  };

  return {
    getUserByToken,
    postUser,
    getUsernameAvailable,
    getEmailAvailable,
    getUserById,
  };
};

const useAuthentication = () => {
  const postLogin = async (creds: Credentials) => {
    const query = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        token
        message
        user {
          user_id
          username
          email
          level_name
          created_at
        }
      }
    }
  `;
    const loginResult = await makeQuery<
      GraphQLResponse<{login: LoginResponse}>,
      Credentials
    >(query, creds);
    console.log(loginResult);
    return loginResult.data.login;
  };

  return {postLogin};
};

const useFile = () => {
  const postFile = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
    };
    return await fetchData<UploadResponse>(
      import.meta.env.VITE_UPLOAD_SERVER + '/upload',
      options,
    );
  };

  return {postFile};
};

const useLike = () => {
  const postLike = async (transaction_id: number, token: string) => {
    // Send a POST request to /likes with object { transaction_id } and the token in the Authorization header.
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({transaction_id}),
    };

    return await fetchData<MessageResponse>(
      import.meta.env.VITE_MEDIA_API + '/likes',
      options,
    );
  };

  const deleteLike = async (like_id: number, token: string) => {
    // Send a DELETE request to /likes/:like_id with the token in the Authorization header.
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      import.meta.env.VITE_MEDIA_API + '/likes/' + like_id,
      options,
    );
  };

  const getCountByTransactionId = async (transaction_id: number) => {
    // Send a GET request to /likes/:transaction_id to get the number of likes.
    return await fetchData<{count: number}>(
      import.meta.env.VITE_MEDIA_API + '/likes/count/' + transaction_id,
    );
  };

  const getUserLike = async (transaction_id: number, token: string) => {
    // Send a GET request to /likes/bytransaction/user/:transaction_id to get the user's like on the transaction.
    const options: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<Like>(
      import.meta.env.VITE_MEDIA_API + '/likes/bytransaction/user/' + transaction_id,
      options,
    );
  };

  return {postLike, deleteLike, getCountByTransactionId, getUserLike};
};

const useComment = () => {
  const postComment = async (
    comment_text: string,
    transaction_id: number,
    token: string,
  ) => {
    // TODO: Send a POST request to /comments with the comment object and the token in the Authorization header.
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({comment_text, transaction_id}),
    };

    return await fetchData<MessageResponse>(
      import.meta.env.VITE_MEDIA_API + '/comments',
      options,
    );
  };

  const {getUserById} = useUser();

  const getCommentsByTransactionId = async (transaction_id: number) => {
    // TODO: Send a GET request to /comments/:transaction_id to get the comments.
    const comments = await fetchData<Comment[]>(
      import.meta.env.VITE_MEDIA_API + '/comments/bytransaction/' + transaction_id,
    );
    // Get usernames for all comments from auth api
    const commentsWithUsername = await Promise.all<
      Comment & {username: string}
    >(
      comments.map(async (comment) => {
        const user = await getUserById(Number(comment.user_id));
        return {...comment, username: user.username};
      }),
    );
    return commentsWithUsername;
  };

  return {postComment, getCommentsByTransactionId};
};

export {useTransaction, useUser, useAuthentication, useFile, useLike, useComment};
