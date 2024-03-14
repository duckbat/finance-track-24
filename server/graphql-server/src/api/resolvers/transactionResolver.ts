//Donex§x§
import {Transaction} from '@sharedTypes/DBTypes';
import {
    fetchAllTransaction,
    fetchTransactionById,
    fetchTransactionByCategory,
    postTransaction,
    postCategoryToTransaction,
    putTransaction,
  } from '../models/transactionModel';
  import {MyContext} from '../../local-types';
  import {GraphQLError} from 'graphql';
  
  export default {
    Query: {
      transactions: async () => {
        return await fetchAllTransaction();
      },
      transaction: async (_parent: undefined, args: {transaction_id: string}) => {
        const id = Number(args.transaction_id);
        return await fetchTransactionById(id);
      },
      transactionsByCategory: async (_parent: undefined, args: {category: string}) => {
        return await fetchTransactionByCategory(args.category);
      },
    },
    Mutation: {
      createTransaction: async (
        _parent: undefined,
        args: {
          input: Omit<
            Transaction,
            'transaction_id' | 'created_at' | 'thumbnail' | 'user_id'
          >;
        },
        context: MyContext,
      ) => {
        if (!context.user || !context.user.user_id) {
          throw new GraphQLError('Not authorized', {
            extensions: {code: 'NOT_AUTHORIZED'},
          });
        }
  
        const userData = {
          ...args.input,
          user_id: context.user.user_id,
        };
  
        return postTransaction(userData);
      },
      addCategoryToTransaction: async (
        _parent: undefined,
        args: {input: {transaction_id: string; category_name: string}},
      ) => {
        console.log(args);
        return await postCategoryToTransaction(
          args.input.category_name,
          Number(args.input.transaction_id),
        );
      },
      updateTransaction: async (
        _parent: undefined,
        args: {
          input: Pick<Transaction, 'title' | 'description'>;
          transaction_id: string;
        },
      ) => {
        return await putTransaction(args.input, Number(args.transaction_id));
      },
    },
  };