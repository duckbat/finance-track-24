import dotenv from 'dotenv';
dotenv.config();
import app from '../src/app';
import {getFound, getNotFound} from './serverFunctions';

describe('GET /graphql', () => {
  // test that server is running
  it('should return 200 OK', async () => {
    await getFound(app, '/');
  });

  // test that you get 404 Not Found
  it('should return 404 Not Found', async () => {
    await getNotFound(app, '/something');
  });
});
