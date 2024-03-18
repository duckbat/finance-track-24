import {Link} from 'react-router-dom';

const About = () => {
  return (
    <>
      <div>
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Do you want people to know what are you spending____{' '}
          <span className="underline-offset-3 underline decoration-blue-400 decoration-8 dark:decoration-blue-600">
            YOUR MONEY ON ??
          </span>
        </h1>
        <p className="pt-3 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-300">
          This super-duper-puper shameful and innovative app will show the world
          what a person like you is spending their money on.
          <hr className="p-2" />
          <div className="m-4 space-y-4">
            <h1 className="mb-4">
              Just do these things to make everyone know about your expense :
            </h1>
            <Link to="/register">
              <li className="underline-offset-3 underline decoration-blue-400 decoration-2 hover:decoration-red-400 dark:decoration-blue-300 hover:dark:decoration-red-300">
                Register your account
              </li>
            </Link>
            <Link to="/login">
              <li className="underline-offset-3 underline decoration-blue-400 decoration-2 hover:decoration-red-400 dark:decoration-blue-300 hover:dark:decoration-red-300">
                Login to your registered account
              </li>
            </Link>
            <Link to="/upload">
              <li className="underline-offset-3 underline decoration-blue-400 decoration-2 hover:decoration-red-400 dark:decoration-blue-300 hover:dark:decoration-red-300">
                Crete your first transaction
              </li>
            </Link>
            <Link to="/">
              <li className="underline-offset-3 underline decoration-blue-400 decoration-2 hover:decoration-red-400 dark:decoration-blue-300 hover:dark:decoration-red-300">
                Enjoy your transaction being displayed on Feed
              </li>
            </Link>
            <Link to="/profile">
              <li className="underline-offset-3 underline decoration-blue-400 decoration-2 hover:decoration-red-400 dark:decoration-blue-300 hover:dark:decoration-red-300">
                In need, you can modify and view all of your transactions here
              </li>
            </Link>
          </div>
        </p>
        <h1>If you want to leave a feedback about the website: </h1>
      </div>
      <h1 style={{marginBottom: '50vh', overflow: 'none', font: 'xxl'}}></h1>
    </>
  );
};

export default About;
