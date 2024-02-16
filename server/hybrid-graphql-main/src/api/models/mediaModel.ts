import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {MediaItem, UserLevel} from '@sharedTypes/DBTypes';
import promisePool from '../../lib/db';
import {fetchData} from '../../lib/functions';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const fetchAllMedia = async (): Promise<MediaItem[] | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(
      `SELECT *,
      CONCAT(?, filename) AS filename,
      CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
      FROM MediaItems`,
      [uploadPath, uploadPath],
    );
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (e) {
    console.error('fetchAllMedia error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const fetchMediaById = async (id: number): Promise<MediaItem | null> => {
  const uploadPath = process.env.UPLOAD_URL;
  try {
    // TODO: replace * with specific column names needed in this case
    const sql = `SELECT *,
                CONCAT(?, filename) AS filename,
                CONCAT(?, CONCAT(filename, "-thumb.png")) AS thumbnail
                FROM MediaItems
                WHERE media_id=?`;
    const params = [uploadPath, uploadPath, id];
    const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(
      sql,
      params,
    );
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    console.error('fetchMediaById error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const postMedia = async (
  media: Omit<MediaItem, 'media_id' | 'created_at' | 'thumbnail'>,
): Promise<MediaItem | null> => {
  const {user_id, filename, filesize, media_type, title, description} = media;
  const sql = `INSERT INTO MediaItems (user_id, filename, filesize, media_type, title, description)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [user_id, filename, filesize, media_type, title, description];
  try {
    const result = await promisePool.execute<ResultSetHeader>(sql, params);
    const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(
      'SELECT * FROM MediaItems WHERE media_id = ?',
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

const putMedia = async (
  media: Pick<MediaItem, 'title' | 'description'>,
  id: number,
  user_id: number,
  user_level: UserLevel['level_name'],
): Promise<MediaItem | null> => {
  try {
    let sql = '';
    if (user_level === 'Admin') {
      sql = promisePool.format('UPDATE MediaItems SET ? WHERE media_id = ?', [
        media,
        id,
      ]);
    } else {
      sql = promisePool.format(
        'UPDATE MediaItems SET ? WHERE media_id = ? AND user_id = ?',
        [media, id, user_id],
      );
    }
    const result = await promisePool.execute<ResultSetHeader>(sql);
    console.log('result', result);
    if (result[0].affectedRows === 0) {
      return null;
    }

    const mediaItem = await fetchMediaById(id);
    if (!mediaItem) {
      return null;
    }
    return mediaItem;
  } catch (e) {
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const deleteMedia = async (
  media_id: number,
  user_id: number,
  token: string,
  level_name: UserLevel['level_name'],
): Promise<MessageResponse> => {
  // get media item from database for filename

  console.log('media_id', media_id, 'user_id', user_id, 'token', token);
  const media = await fetchMediaById(media_id);

  if (!media) {
    return {message: 'Media not found'};
  }

  // remove environment variable UPLOAD_URL from filename
  media.filename = media?.filename.replace(
    process.env.UPLOAD_URL as string,
    '',
  );

  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute('DELETE FROM Likes WHERE media_id = ?;', [
      media_id,
    ]);

    await connection.execute('DELETE FROM Comments WHERE media_id = ?;', [
      media_id,
    ]);

    await connection.execute('DELETE FROM Ratings WHERE media_id = ?;', [
      media_id,
    ]);

    await connection.execute('DELETE FROM MediaItemTags WHERE media_id = ?;', [
      media_id,
    ]);

    let sql = '';
    if (level_name === 'Admin') {
      sql = connection.format('DELETE FROM MediaItems WHERE media_id = ?', [
        media_id,
      ]);
    } else {
      sql = connection.format(
        'DELETE FROM MediaItems WHERE media_id = ? AND user_id = ?',
        [media_id, user_id],
      );
    }
    console.log(sql);
    // note, user_id in SQL so that only the owner of the media item can delete it
    const [result] = await connection.execute<ResultSetHeader>(sql);

    if (result.affectedRows === 0) {
      return {message: 'Media not deleted'};
    }

    // delete file from upload server
    const options = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    // separate try-catch block for delete request to upload server
    // so that it doesn't affect the transaction
    // (there might be items without files when testing)
    try {
      const deleteResult = await fetchData<MessageResponse>(
        `${process.env.UPLOAD_SERVER}/delete/${media.filename}`,
        options,
      );

      console.log('deleteResult', deleteResult);
    } catch (e) {
      console.error('file delete error', (e as Error).message);
    }

    // if no errors commit transaction
    await connection.commit();

    return {
      message: 'Media deleted',
    };
  } catch (e) {
    await connection.rollback();
    console.error('error', (e as Error).message);
    throw new Error((e as Error).message);
  } finally {
    connection.release();
  }
};

const fetchMostLikedMedia = async (): Promise<MediaItem | undefined> => {
  try {
    const [rows] = await promisePool.execute<
      RowDataPacket[] & MediaItem[] & {likes_count: number}
    >('SELECT * FROM `MostLikedMedia`');
    if (rows.length === 0) {
      return undefined;
    }
    // add server url to filename because it can't be added in the SQL view
    rows[0].filename = process.env.UPLOAD_URL + '/uploads/' + rows[0].filename;
    // add thumbnail to object for the same reason
    rows[0].thumbnail =
      process.env.UPLOAD_URL + '/uploads/' + rows[0].filename + '-thumb.png';
    console.log(rows[0]);
    return rows[0];
  } catch (e) {
    console.error('getMostLikedMedia error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const fetchMostCommentedMedia = async (): Promise<MediaItem | undefined> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(
      'SELECT * FROM `MostCommentedMedia`',
    );
    if (rows.length === 0) {
      return undefined;
    }
    // add server url to filename because it can't be added in the SQL view
    rows[0].filename = process.env.UPLOAD_URL + '/uploads/' + rows[0].filename;
    // add thumbnail to object for the same reason
    rows[0].thumbnail =
      process.env.UPLOAD_URL + '/uploads/' + rows[0].filename + '-thumb.png';
    return rows[0];
  } catch (e) {
    console.error('getMostCommentedMedia error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

const fetchHighestRatedMedia = async (): Promise<MediaItem | undefined> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(
      'SELECT * FROM `HighestRatedMedia`',
    );
    if (rows.length === 0) {
      return undefined;
    }
    // add server url to filename because it can't be added in the SQL view
    rows[0].filename = process.env.UPLOAD_URL + '/uploads/' + rows[0].filename;
    // add thumbnail to object for the same reason
    rows[0].thumbnail =
      process.env.UPLOAD_URL + '/uploads/' + rows[0].filename + '-thumb.png';
    return rows[0];
  } catch (e) {
    console.error('getHighestRatedMedia error', (e as Error).message);
    throw new Error((e as Error).message);
  }
};

export {
  fetchAllMedia,
  fetchMediaById,
  postMedia,
  deleteMedia,
  fetchMostLikedMedia,
  fetchMostCommentedMedia,
  fetchHighestRatedMedia,
  putMedia,
};
