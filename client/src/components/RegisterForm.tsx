import React, { useState } from 'react';
import { useUser } from '../hooks/graphQLHooks';
import { useForm } from '../hooks/formHooks';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
const RegisterForm = () => {
  const { postUser } = useUser();
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(true);
  const [emailAvailable, setEmailAvailable] = useState<boolean>(true);
  const navigate = useNavigate(); // Access the navigate function

  const initValues = { username: '', password: '', email: '' };

  const doRegister = async () => {
    try {
      if (usernameAvailable && emailAvailable) {
        await postUser(inputs);
        // Redirect to login after registration
        navigate('/login');
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const { handleSubmit, handleInputChange, inputs } = useForm(doRegister, initValues);
  const { getUsernameAvailable, getEmailAvailable } = useUser();

  const handleUsernameBlur = async (event: React.SyntheticEvent<HTMLInputElement>) => {
    const result = await getUsernameAvailable(event.currentTarget.value);
    setUsernameAvailable(result.available);
  };

  const handleEmailBlur = async () => {
    const result = await getEmailAvailable(inputs.email);
    setEmailAvailable(result.available);
  };

  console.log(usernameAvailable, emailAvailable);

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col text-center">
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="username">
            Username
          </label>
          <input
            className="border-slate-500 text-slate-950 m-3 w-2/3 rounded-md border p-3"
            name="username"
            type="text"
            id="username"
            onChange={handleInputChange}
            onBlur={handleUsernameBlur}
            autoComplete="username"
          />
        </div>
        {!usernameAvailable && (
          <div className="flex w-4/5 justify-end pr-4">
            <p className="text-red-500">Username not available</p>
          </div>
        )}
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="password">
            Password
          </label>
          <input
            className="border-slate-500 text-slate-950 m-3 w-2/3 rounded-md border p-3"
            name="password"
            type="password"
            id="password"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="email">
            Email
          </label>
          <input
            className="border-slate-500 text-slate-950 m-3 w-2/3 rounded-md border p-3"
            name="email"
            type="email"
            id="email"
            onChange={handleInputChange}
            onBlur={handleEmailBlur}
            autoComplete="email"
          />
        </div>
        {!emailAvailable && (
          <div className="flex w-4/5 justify-end pr-4">
            <p className="text-red-500">Email not available</p>
          </div>
        )}
        <div className="flex w-4/5 justify-end">
          <button className="bg-slate-700 m-3 w-1/3 rounded-md p-3" type="submit">
            Register
          </button>
          <p>
            Already have an account?{' '}
            <Link to="/login" className="underline">
              Log in
            </Link>{' '}
          </p>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
