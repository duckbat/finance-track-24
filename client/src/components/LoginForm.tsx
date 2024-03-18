import {useForm} from '../hooks/formHooks';
import {Credentials} from '../types/LocalTypes';
import {useUserContext} from '../hooks/ContextHooks';
import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';

const LoginForm = () => {
  const {handleLogin} = useUserContext();
  const navigate = useNavigate(); // Access the navigate function

  const initValues: Credentials = {username: '', password: ''};

  const doLogin = async () => {
    await handleLogin(inputs as Credentials);
    // Redirect to the profile page after successful login
    navigate('/profile');
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(
    doLogin,
    initValues,
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Username input */}
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="UserWithLevelname">
            Username
          </label>
          <input
            className="border-slate-500 text-slate-950 m-3 w-2/3 rounded-md border p-3"
            name="username"
            type="text"
            id="UserWithLevelname"
            value={inputs.username}
            onChange={handleInputChange}
            autoComplete="username"
          />
        </div>
        {/* Password input */}
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="loginpassword">
            Password
          </label>
          <input
            className="border-slate-500 text-slate-950 m-3 w-2/3 rounded-md border p-3"
            name="password"
            type="password"
            id="loginpassword"
            value={inputs.password}
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        {/* Submit button */}
        <div className="flex w-4/5 justify-end">
          <button
            className="bg-slate-700 m-3 w-1/3 rounded-md p-3 text-white"
            type="submit"
          >
            Login
          </button>
        <p className="pb-5">
          Don't have an account?{' '}
          <Link to="/register" className="underline">
            Sign In
          </Link>
        </p>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
