//Done
import { Category } from '@sharedTypes/DBTypes';
import {
    deleteCategory,
    fetchAllCategories,
    fetchCategoriesByTransactionId,
    postCategory,
  } from '../models/categoryModel';
  
  export default {
    Transaction: {
      category: async (parent: {transaction_id: string}) => {
        console.log(parent);
        return await fetchCategoriesByTransactionId(Number(parent.transaction_id));
      },
    },
    Query: {
      categories: async () => {
        return await fetchAllCategories();
      },
    },
    Mutation: {
        createCategory: async (
        _parent: undefined,
        args: {input: Omit<Category, 'category_id'>},
      ) => {
        return await postCategory(args.input);
      },
      deleteCategory: async (_parent: undefined, args: {input: string}) => {
        return await deleteCategory(Number(args.input));
      },
    },
  };