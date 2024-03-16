import {useForm} from '../hooks/formHooks';
import {Credentials} from '../types/LocalTypes';
import {useUserContext} from '../hooks/ContextHooks';

const LoginForm = () => {
  const {handleLogin} = useUserContext();

  const initValues: Credentials = {username: '', password: ''};

  const doLogin = async () => {
    handleLogin(inputs as Credentials);
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(
    doLogin,
    initValues,
  );

  return (
    <>
      <h3 className="text-3xl">Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="UserWithLevelname">
            Username
          </label>
          <input
            className="m-3 w-2/3 rounded-md border border-slate-500 p-3 text-slate-950"
            name="username"
            type="text"
            id="UserWithLevelname"
            onChange={handleInputChange}
            autoComplete="username"
          />
        </div>
        <div className="flex w-4/5">
          <label className="w-1/3 p-6 text-end" htmlFor="loginpassword">
            Password
          </label>
          <input
            className="m-3 w-2/3 rounded-md border border-slate-500 p-3 text-slate-950"
            name="password"
            type="password"
            id="loginpassword"
            onChange={handleInputChange}
            autoComplete="current-password"
          />
        </div>
        <div className="flex w-4/5 justify-end">
          <button
            className="m-3 w-1/3 rounded-md bg-slate-700 p-3"
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
