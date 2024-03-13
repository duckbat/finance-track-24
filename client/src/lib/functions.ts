import {ErrorResponse} from '../types/MessageTypes';

const fetchData = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  console.log('fetching data from url: ', url);
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok) {
    const errorJson = json as unknown as ErrorResponse;
    console.log('errorJson', errorJson);
    if (errorJson.message) {
      throw new Error(errorJson.message);
    }
    throw new Error(`Error ${response.status} occured`);
  }
  return json;
};

const makeQuery = async <TF, TV>(
  query: string,
  variables?: TV,
  token?: string,
): Promise<TF> => {
  const headers: {'Content-Type': string; Authorization?: string} = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const body: {query: string; variables?: TV} = {
    query,
  };

  if (variables) {
    body.variables = variables;
  }

  const options: RequestInit = {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  };
  return await fetchData<TF>(import.meta.env.VITE_GRAPHQL_API, options);
};

export {fetchData, makeQuery};
