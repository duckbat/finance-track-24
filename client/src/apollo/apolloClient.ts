/* eslint-disable @typescript-eslint/no-unused-vars */
// Testing query and mutations with ApolloProvider
import { gql } from '@apollo/client';

// Define GraphQL queries
const GET_TRANSACTIONS = gql`
  query GetTransactions {
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

// Define GraphQL mutations
const POST_TRANSACTION = gql`
  mutation PostTransaction($file: UploadResponse!, $inputs: TransactionInput!, $token: String!) {
    postTransaction(file: $file, inputs: $inputs, token: $token) {
      transaction_id
      title
      description
      filename
      filesize
      media_type
    }
  }
`;

const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($transactionId: ID!, $token: String!) {
    deleteTransaction(transaction_id: $transactionId, token: $token) {
      message
    }
  }
`;

export default DELETE_TRANSACTION; GET_TRANSACTIONS; POST_TRANSACTION;
