//Done
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Category, CategoryResult} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {MessageResponse} from '@sharedTypes/MessageTypes';

// Request a list of categories
const fetchAllCategories = async (): Promise<Category[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Category[]>(
      'SELECT * FROM Categories',
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllCategories error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Post a new category
const postCategory = async (category: Omit<Category, 'category_id'>): Promise<Category | null> => {
  try {
    // check if category exists (case insensitive)
    const sql = promisePool.format('SELECT * FROM Categories WHERE category_name = ?', [
      category.category_name,
    ]);
    const [result] = await promisePool.execute<RowDataPacket[]>(sql);
    if (result.length > 0) {
      return null;
      // throw new Error('Category already exists');
    }

    const [categoryResult] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Categories (category_name) VALUES (?)',
      [category.category_name],
    );
    if (categoryResult.affectedRows === 0) {
      return null;
    }

    const sql2 = promisePool.format('SELECT * FROM Categories WHERE category_id = ?', [
      categoryResult.insertId,
    ]);
    const [selectResult] = await promisePool.execute<RowDataPacket[] & Category[]>(
      sql2,
    );

    if (selectResult.length > 0) {
      return selectResult[0];
    }
    return null;
  } catch (e) {
    console.error('postCategory error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Request a list of categories by transaction id
const fetchCategoriesByTransactionId = async (id: number): Promise<CategoryResult[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & CategoryResult[]>(
      `SELECT Categories.category_id, Categories.category_name, TransactionCategories.transaction_id
       FROM Categories
       JOIN TransactionCategories ON Categories.category_id = TransactionCategories.category_id
       WHERE TransactionCategories.category_id = ?`,
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchCategoriesByTransactionID error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Delete a category
const deleteCategory = async (id: number): Promise<MessageResponse | null> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const [TransactionCategoryResult] = await connection.execute<ResultSetHeader>(
      'DELETE FROM TransactionCategories WHERE category_id = ?',
      [id],
    );

    if (TransactionCategoryResult.affectedRows === 0) {
      return null;
    }

    const [categoryResult] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Categories WHERE category_id = ?',
      [id],
    );

    if (categoryResult.affectedRows === 0) {
      return null;
    }

    await connection.commit();

    if (TransactionCategoryResult.affectedRows === 0) {
      return null;
    }

    return {message: 'Category deleted'};
  } catch (e) {
    await connection.rollback();
    console.error('deleteCategory error', (e as Error).message);
    throw new Error((e as Error).message);
  } finally {
    connection.release();
  }
};

export {fetchAllCategories, postCategory, fetchCategoriesByTransactionId, deleteCategory};