//Done
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Transaction, TokenContent} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {TransactionResponse, MessageResponse} from '@sharedTypes/MessageTypes';

/**
 * Get all Transaction items from the database
 *
 * @returns {array} - array of Transaction items
 * @throws {Error} - error if database query fails
 */

const fetchAllTransaction = async (): Promise<Transaction[] | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Transaction[]>(
      `SELECT *,
      CONCAT(?, filename) AS filename,
      CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
      FROM Transactions`,
      [uploadPath, uploadPath],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllTransaction error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Request a list of Transaction items by category
const fetchTransactionByCategory = async (category: string): Promise<Transaction[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Transaction[]>(
      `SELECT Transactions.*,
      CONCAT(?, Transactions.filename) AS filename,
      CONCAT(?, CONCAT(Transactions.filename, "-thumb.png")) AS thumbnail
      FROM Transactions
      JOIN TransactionCategories ON Transactions.transaction_id = TransactionCategories.transaction_id
      JOIN Categories ON TransactionCategories.category_id = Categories.category_id
      WHERE Categories.category_name = ?`,
      [process.env.UPLOAD_URL, process.env.UPLOAD_URL, category],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchTransactionByCategory error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const fetchAllTransactionByAppId = async (
  id: string,
): Promise<Transaction[] | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Transaction[]>(
      `SELECT *,
      CONCAT(?, filename) AS filename,
      CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
      FROM Transactions
      WHERE app_id = ?`,
      [uploadPath, uploadPath, id],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllTransaction error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get Transaction item by id from the database
 *
 * @param {number} id - id of the Transaction item
 * @returns {object} - object containing all information about the Transaction item
 * @throws {Error} - error if database query fails
 */

const fetchTransactionById = async (id: number): Promise<Transaction | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    // TODO: replace * with specific column names needed in this case
    const sql = `SELECT *,
                CONCAT(?, filename) AS filename,
                CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
                FROM Transactions
                WHERE transaction_id=?`;
    const params = [uploadPath, uploadPath, id];
    const [rows] = await promisePool.execute<RowDataPacket[] & Transaction[]>(
      sql,
      params,
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('fetchTransactionById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Add new Transaction item to database
 *
 * @param {object} transaction - object containing all information about the new Transaction item
 * @returns {object} - object containing id of the inserted Transaction item in db
 * @throws {Error} - error if database query fails
 */
const postTransaction = async (
  transaction: Omit<Transaction, 'transaction_id' | 'created_at' | 'thumbnail'>,
): Promise<Transaction | null> => {
  const {user_id, filename, filesize, media_type, title, description} = transaction;
  const sql = `INSERT INTO Transactions (user_id, filename, filesize, media_type, title, description)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [user_id, filename, filesize, media_type, title, description];
  try {
    const result = await promisePool.execute<ResultSetHeader>(sql, params);
    const [rows] = await promisePool.execute<RowDataPacket[] & Transaction[]>(
      'SELECT * FROM Transactions WHERE transaction_id = ?',
      [result[0].insertId],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Update Transaction item in database
 *
 * @param {object} transaction - object containing all information about the Transaction item
 * @param {number} id - id of the Transaction item
 * @returns {object} - object containing id of the updated Transaction item in db
 * @throws {Error} - error if database query fails
 */

const putTransaction = async (
  Transaction: Pick<Transaction, 'title' | 'description'>,
  id: number,
): Promise<TransactionResponse | null> => {
  try {
    const sql = promisePool.format(
      'UPDATE Transactions SET ? WHERE transaction_id = ?',
      [Transaction, id],
    );
    const result = await promisePool.execute<ResultSetHeader>(sql);
    console.log('result', result);
    if (result[0].affectedRows === 0) {
      return null;
    }

    const transaction = await fetchTransactionById(id);
    if (!transaction) {
      return null;
    }
    return {message: 'Transaction updated', /*possible problem*/transaction: transaction};
  } catch (e) {
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Delete Transaction item from database
 *
 * @param {number} id - id of the Transaction item
 * @returns {object} - object containing id of the deleted Transaction item in db
 * @throws {Error} - error if database query fails
 */

const deleteTransaction = async (
  id: number,
  user: TokenContent,
  token: string,
): Promise<MessageResponse> => {
  console.log('deleteTransaction', id);
  const Transaction = await fetchTransactionById(id);
  console.log(Transaction);

  if (!Transaction) {
    return {message: 'Transaction not found'};
  }

  // if admin add user_id from Transaction object to user object from token content
  if (user.level_name === 'Admin') {
    user.user_id = Transaction.user_id;
  }

  // remove environment variable UPLOAD_URL from filename
  Transaction.filename = Transaction?.filename.replace(
    process.env.UPLOAD_URL as string,
    '',
  );

  console.log(token);

  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute('DELETE FROM Likes WHERE transaction_id = ?;', [id]);

    await connection.execute('DELETE FROM Comments WHERE transaction_id = ?;', [id]);

    await connection.execute('DELETE FROM Ratings WHERE transaction_id = ?;', [id]);

    // ! user_id in SQL so that only the owner of the Transaction item can delete it
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Transactions WHERE transaction_id = ? and user_id = ?;',
      [id, user.user_id],
    );

    if (result.affectedRows === 0) {
      return {message: 'Transaction not deleted'};
    }

    // delete file from upload server
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    const deleteResult = await fetchData<MessageResponse>(
      `${process.env.UPLOAD_SERVER}/delete/${Transaction.filename}`,
      options,
    );

    console.log('deleteResult', deleteResult);
    if (deleteResult.message !== 'File deleted') {
      throw new Error('File not deleted');
    }

    // if no errors commit transaction
    await connection.commit();

    return {message: 'Transaction deleted'};
  } catch (e) {
    await connection.rollback();
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  } finally {
    connection.release();
  }
};

/**
 * Get all the most liked Transaction items from the database
 *
 * @returns {object} - object containing all information about the most liked Transaction item
 * @throws {Error} - error if database query fails
 */

const fetchMostLikedTransaction = async (): Promise<Transaction | undefined> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Transaction[]>(
      'SELECT * FROM `MostLikedTransaction`',
    );
    if (rows.length === 0) {
      return undefined;
    }
    rows[0].filename =
      process.env.Transaction_SERVER + '/uploads/' + rows[0].filename;
  } catch (e) {
    console.error('getMostLikedTransaction error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get all the most commented Transaction items from the database
 *
 * @returns {object} - object containing all information about the most commented Transaction item
 * @throws {Error} - error if database query fails
 */

const fetchMostCommentedTransaction = async (): Promise<Transaction | undefined> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Transaction[]>(
      'SELECT * FROM `MostCommentedTransaction`',
    );
    if (rows.length === 0) {
      return undefined;
    }
    rows[0].filename =
      process.env.Transaction_SERVER + '/uploads/' + rows[0].filename;
  } catch (e) {
    console.error('getMostCommentedTransaction error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

/**
 * Get all the highest rated Transaction items from the database
 *
 * @returns {object} - object containing all information about the highest rated Transaction item
 * @throws {Error} - error if database query fails
 */

const fetchHighestRatedTransaction = async (): Promise<Transaction | undefined> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Transaction[]>(
      'SELECT * FROM `HighestRatedTransaction`',
    );
    if (rows.length === 0) {
      return undefined;
    }
    rows[0].filename =
      process.env.Transaction_SERVER + '/uploads/' + rows[0].filename;
    return rows[0];
  } catch (e) {
    console.error('getHighestRatedTransaction error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Attach a category to a Transaction item
const postCategoryToTransaction = async (
  category_name: string,
  transaction_id: number,
): Promise<Transaction | null> => {
  try {
    let category_id: number = 0;
    // check if category exists (case insensitive)
    const [CategoryResult] = await promisePool.execute<RowDataPacket[]>(
      'SELECT * FROM Categories WHERE category_name = ?',
      [category_name],
    );
    if (CategoryResult.length === 0) {
      // if category does not exist create it
      const [insertResult] = await promisePool.execute<ResultSetHeader>(
        'INSERT INTO Categories (category_name) VALUES (?)',
        [category_name],
      );
      // get category_id from created category
      if (insertResult.affectedRows === 0) {
        return null;
      }
      category_id = insertResult.insertId;
    } else {
      // if category exists get category_id from the first result
      category_id = CategoryResult[0].category_id;
    }
    const [TransactionCategoryResult] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO TransactionCategories (category_id, transaction_id) VALUES (?, ?)',
      [category_id, transaction_id],
    );
    if (TransactionCategoryResult.affectedRows === 0) {
      return null;
    }

    return await fetchTransactionById(transaction_id);
  } catch (e) {
    console.error('postCategoryToTransaction error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {
  fetchAllTransaction,
  fetchAllTransactionByAppId,
  fetchTransactionByCategory,
  fetchTransactionById,
  postTransaction,
  deleteTransaction,
  fetchMostLikedTransaction,
  fetchMostCommentedTransaction,
  fetchHighestRatedTransaction,
  putTransaction,
  postCategoryToTransaction,
};
