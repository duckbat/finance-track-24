import {fetchData} from './functions';
import {Transaction, UserWithNoPassword} from '@sharedTypes/DBTypes';
import {LoginResponse, UploadResponse} from '@sharedTypes/MessageTypes';

// select forms from the DOM
const loginForm = document.querySelector('#login-form');
const fileForm = document.querySelector('#file-form');

// select inputs from the DOM
const usernameInput = document.querySelector(
  '#username'
) as HTMLInputElement | null;
const passwordInput = document.querySelector(
  '#password'
) as HTMLInputElement | null;
const titleInput = document.querySelector('#title') as HTMLInputElement | null;
const descriptionInput = document.querySelector(
  '#description'
) as HTMLTextAreaElement | null;
const fileInput = document.querySelector('#file') as HTMLInputElement | null;

// select profile elements from the DOM
const usernameTarget = document.querySelector('#username-target');
const emailTarget = document.querySelector('#email-target');

// select media elements from the DOM
const filesList = document.querySelector('#files-list');

// function to login
const login = async (): Promise<LoginResponse> => {
  // grapql query to login (copy from sandbox)
  const query = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        token
        message
        user {
          user_id
          username
          email
          level_name
          profile_pic
          created_at
        }
      }
    }
  `;

  const variables = {
    username: usernameInput && usernameInput.value,
    password: passwordInput && passwordInput.value,
  };

  const options = {
    method: 'POST',
    body: JSON.stringify({query, variables}),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const loginResponse = await fetchData<{data: {login: LoginResponse}}>(
    import.meta.env.VITE_GRAPHQL_SERVER,
    options
  );
  return loginResponse.data.login;
};

// TODO: function to upload a file
const uploadFile = async (): Promise<UploadResponse> => {
  const formData = new FormData();
  if (fileInput && fileInput.files) {
    formData.append('file', fileInput.files[0]);
  }
  const options = {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  };
  const uploadResponse = await fetchData<UploadResponse>(
    import.meta.env.VITE_UPLOAD_SERVER + '/upload',
    options
  );
  console.log(uploadResponse);
  return uploadResponse;
};

// TODO funtion to post a file to the API
const postFile = async (uploadResponse: UploadResponse) => {
  const query = `
  mutation CreateTransaction($input: TransactionInput!) {
    createTransaction(input: $input) {
      title
    }
  }
  `;

  const variables = {
    input: {
      title: titleInput && titleInput.value,
      description: descriptionInput && descriptionInput.value,
      filename: uploadResponse.data.filename,
      media_type: uploadResponse.data.media_type,
      filesize: uploadResponse.data.filesize,
    },
  };

  const options = {
    method: 'POST',
    body: JSON.stringify({query, variables}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  };

  const postResponse = await fetchData<{
    data: {createMediaItem: Pick<Transaction, 'title'>};
  }>(import.meta.env.VITE_GRAPHQL_SERVER, options);

  console.log(postResponse);
  return postResponse;
};

// function to add userdata (email, username) to the
// Profile DOM elements
const addUserDataToDom = (user: UserWithNoPassword): void => {
  if (!usernameTarget || !emailTarget) {
    return;
  }
  usernameTarget.textContent = user.username;
  emailTarget.textContent = user.email;
};

// function to add file data (filename, mimetype) to the
// Media DOM elements
// function to add file data (filename) to the Media DOM elements
const addFilesToDom = async () => {
  try {
    if (!filesList) {
      return;
    }
    filesList.innerHTML = '';

    // grapql query to get all files (copy from sandbox)
    const query = `
      query Transactions {
        transactions {
          title
        }
      }
    `;
    const options = {
      method: 'POST',
      body: JSON.stringify({query}),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const fileItems = await fetchData<{data: {transactions: Transaction[]}}>(
      import.meta.env.VITE_GRAPHQL_SERVER,
      options
    );
    console.log(fileItems);
    // loop through files and add them to the DOM
    fileItems.data.transactions.forEach((file: any) => {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      const a = document.createElement('a');
      a.href = file.filename;
      a.textContent = 'Open ' + file.title;
      td.appendChild(a);
      tr.appendChild(td);
      filesList.appendChild(tr);
    });
  } catch (error) {
    console.log(error);
  }
};



addFilesToDom();

// function to get userdata from API using token
const getUserData = async (token: string): Promise<UserWithNoPassword> => {
  const query = `
      query CheckToken {
        checkToken {
          user_id
          username
          email
          level_name
          created_at
        }
      }
    `;
  const options = {
    method: 'POST',
    body: JSON.stringify({query}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  };
  const user = await fetchData<{data: {checkToken: UserWithNoPassword}}>(
    import.meta.env.VITE_GRAPHQL_SERVER,
    options
  );
  return user.data.checkToken;
};

// function to check local storage for token and if it exists fetch
// userdata with getUserData then update the DOM with addUserDataToDom
const checkToken = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const user = await getUserData(token);
      addUserDataToDom(user);
    } catch (error) {
      console.log(error);
    }
  }
};

// call checkToken on page load to check if token exists and update the DOM
checkToken();

// login form event listener
// event listener should call login function and save token to local storage
// then call addUserDataToDom to update the DOM with the user data
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const loginResponse = await login();
      localStorage.setItem('token', loginResponse.token);
      addUserDataToDom(loginResponse.user);
      alert(loginResponse.message);
    } catch (error) {
      console.log(error);
      alert((error as Error).message);
    }
  });
}

// TODO: file form event listener
// event listener should call uploadFile function to upload the file
// then call postFile function to post the file to the GraphQL API
// then call addFileToDom to update the DOM with the file data
if (fileForm) {
  fileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const uploadResponse = await uploadFile();
      await postFile(uploadResponse);
      addFilesToDom();
    } catch (error) {
      console.log(error);
      alert((error as Error).message);
    }
  });
}
