import { ErrorResponse } from "../types/MessageTypes";


const fetchData = async <T>(url: string,
  options: RequestInit = {},
  ): Promise<T> => {
  console.log('fetchData from url:', url);
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


const makeQuery = async (query, variables, token) => {
  const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
  };

  const body = {
      query,
      variables,
  };
  const options: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
  };
  return await fetchData(
      import.meta.env.VITE_GRAPHQL_API as string,
      options,
  );
};

export {fetchData, makeQuery};
