//Done
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Category, CategoryResult} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {MessageResponse} from '@sharedTypes/MessageTypes';

// Request a list of Categories
const fetchAllCategories = async (): Promise<Category[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Category[]>(
      'SELECT * FROM Category',
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

// Post a new Category
const postCategory = async (
  Category: Omit<Category, 'Category_id'>,
): Promise<MessageResponse | null> => {
  try {
    const [CategoryResult] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Categories (Category_name) VALUES (?)',
      [Category.category_name],
    );
    if (CategoryResult.affectedRows === 0) {
      return null;
    }

    return {message: 'Category created'};
  } catch (e) {
    console.error('postCategory error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Request a list of Categories by media item id
const fetchCategoryByMediaId = async (id: number): Promise<CategoryResult[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & CategoryResult[]>(
      `SELECT Categories.Category_id, Categories.Category_name, MediaItemCategories.media_id
       FROM Categories
       JOIN MediaItemCategoies ON Categoies.Category_id = MediaItemCategories.Category_id
       WHERE MediaItemCategories.media_id = ?`,
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchCategoriesByMediaId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Delete a Category
const deleteCategory = async (id: number): Promise<MessageResponse | null> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const [mediaItemCategoryResult] = await connection.execute<ResultSetHeader>(
      'DELETE FROM MediaItemCategories WHERE Category_id = ?',
      [id],
    );

    if (mediaItemCategoryResult.affectedRows === 0) {
      return null;
    }

    const [CategoryResult] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Categories WHERE Category_id = ?',
      [id],
    );

    if (CategoryResult.affectedRows === 0) {
      return null;
    }

    await connection.commit();

    if (mediaItemCategoryResult.affectedRows === 0) {
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

export {fetchAllCategories, postCategory, fetchCategoryByMediaId, deleteCategory};
