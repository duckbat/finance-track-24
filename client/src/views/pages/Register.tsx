import RegisterForm from '../../components/RegisterForm';

const Register = () => {
  return (
    <>
      <h1 className="pb-20 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Register
      </h1>
      <div className="pt-20">
        <RegisterForm />
      </div>
      <h1 style={{marginBottom: '400px', overflow: 'none', font: 'xxl'}}></h1>
    </>
  );
};

export default Register;
