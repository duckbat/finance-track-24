import {Link} from 'react-router-dom';

const AboutText = () => {
  return (
    <>
      <div>
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Share your media with people {' '}
          <br />
          <span className="underline-offset-3 underline decoration-blue-400 decoration-8 dark:decoration-blue-600">
            Don't be shy
          </span>
        </h1>
        <p className="pt-3 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-300">
          This is super duper puper app, that lets you post things you want to post{' '}
        </p>
        <hr className="p-2" />
        <div className="m-4 space-y-4">
          <h1 className="mb-4">
            Just do these things to start posting your images :
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
              Add your first media
            </li>
          </Link>
          <Link to="/">
            <li className="underline-offset-3 underline decoration-blue-400 decoration-2 hover:decoration-red-400 dark:decoration-blue-300 hover:dark:decoration-red-300">
              Enjoy your cat pitcures being displayed on Feed
            </li>
          </Link>
          <Link to="/profile">
            <li className="underline-offset-3 underline decoration-blue-400 decoration-2 hover:decoration-red-400 dark:decoration-blue-300 hover:dark:decoration-red-300">
              In need, you can modify and view all of your medias here "BETA" (probably doesn't work yet)
            </li>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AboutText;

