import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Comment, UserLevel} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {MessageResponse} from '@sharedTypes/MessageTypes';

// Request a list of comments
const fetchAllComments = async (): Promise<Comment[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Comment[]>(
      'SELECT * FROM Comments',
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllComments error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Request a list of comments by media item id
const fetchCommentsByMediaId = async (
  id: number,
): Promise<Comment[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Comment[]>(
      'SELECT * FROM Comments WHERE media_id = ?',
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchCommentsByMediaId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Request a count of comments by media item id
const fetchCommentsCountByMediaId = async (
  id: number,
): Promise<number | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Comment[]>(
      'SELECT COUNT(*) as commentsCount FROM Comments WHERE media_id = ?',
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0].commentsCount;
  } catch (e) {
    console.error('fetchCommentsCountByMediaId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Request a list of comments by user id
const fetchCommentsByUserId = async (id: number): Promise<Comment[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Comment[]>(
      'SELECT * FROM Comments WHERE user_id = ?',
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchCommentsByUserId error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Request a comment by id
const fetchCommentById = async (id: number): Promise<Comment | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Comment[]>(
      'SELECT * FROM Comments WHERE comment_id = ?',
      [id],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('fetchCommentById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Create a new comment
const postComment = async (
  media_id: number,
  user_id: number,
  comment_text: string,
): Promise<MessageResponse | null> => {
  try {
    const sql = promisePool.format(
      'INSERT INTO Comments (media_id, user_id, comment_text) VALUES (?, ?, ?)',
      [media_id, user_id, comment_text],
    );
    console.log(sql);
    const [result] = await promisePool.execute<ResultSetHeader>(sql);
    if (result.affectedRows === 0) {
      return null;
    }
    return {message: 'Comment added'};
  } catch (e) {
    console.error('createComment error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Update a comment
const updateComment = async (
  comment_text: string,
  comment_id: number,
  user_id: number,
  user_level: UserLevel['level_name'],
): Promise<MessageResponse | null> => {
  try {
    let sql = '';
    if (user_level === 'Admin') {
      sql = 'UPDATE Comments SET comment_text = ? WHERE comment_id = ?';
    } else {
      sql =
        'UPDATE Comments SET comment_text = ? WHERE comment_id = ? AND user_id = ?';
    }
    const [result] = await promisePool.execute<ResultSetHeader>(sql, [
      comment_text,
      comment_id,
      user_id,
    ]);
    if (result.affectedRows === 0) {
      return null;
    }
    return {message: 'Comment updated'};
  } catch (e) {
    console.error('updateComment error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

// Delete a comment
const deleteComment = async (
  id: number,
  user_id: number,
  user_level: UserLevel['level_name'],
): Promise<MessageResponse | null> => {
  try {
    let sql = '';
    if (user_level === 'Admin') {
      sql = 'DELETE FROM Comments WHERE id = ?';
    } else {
      sql = 'DELETE FROM Comments WHERE id = ? AND user_id = ?';
    }
    const [result] = await promisePool.execute<ResultSetHeader>(sql, [
      id,
      user_id,
    ]);
    if (result.affectedRows === 0) {
      return null;
    }
    return {message: 'Comment deleted'};
  } catch (e) {
    console.error('deleteComment error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {
  fetchAllComments,
  fetchCommentsByMediaId,
  fetchCommentsCountByMediaId,
  fetchCommentsByUserId,
  fetchCommentById,
  postComment,
  updateComment,
  deleteComment,
};
