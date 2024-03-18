import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <>
      <h1 className="pb-10 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Login
      </h1>
      <LoginForm />
      <h1 style={{marginBottom: '1080px', overflow: 'none', font: 'xxl'}}></h1>
    </>
  );
};

export default Login;
