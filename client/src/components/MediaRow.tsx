import {MediaItemWithOwner} from '../types/DBTypes';
import {useUpdateContext, useUserContext} from '../hooks/ContextHooks';
import {useMedia} from '../hooks/graphQLHooks';
import Likes from './Likes';
import Comment from './Comment';
import {Link} from 'react-router-dom';

const MediaRow = (props: {item: MediaItemWithOwner}) => {
  const {item} = props;
  const {user} = useUserContext();
  const {deleteMedia} = useMedia();
  const {update, setUpdate} = useUpdateContext();

  const deleteHandler = async () => {
    const cnf = confirm('Are you sure you want to delete this media?');
    if (!cnf) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      const result = await deleteMedia(item.media_id, token);
      alert(result.message);
      setUpdate(!update);
    } catch (e) {
      console.error('delete failed', (e as Error).message);
    }
  };

  return (
    <div>
      <div className=" flex flex-col rounded-lg border border-gray-200 bg-white shadow xl:max-w-6xl xl:flex-row dark:border-gray-700 dark:bg-gray-800">
        <img
          className="h-96 w-full rounded-t-lg object-cover xl:h-auto xl:w-96 xl:rounded-none xl:rounded-l-lg"
          src={item.thumbnail}
          alt={item.title}
        />
        <div className="justify-right flex w-full flex-col p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight  text-gray-900 dark:text-white">
            {item.title}
          </h5>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {item.description}
          </p>
          <p className="mb-3 font-normal text-gray-700 underline underline-offset-2 dark:text-gray-400">
            by: {item.owner.username}
          </p>
          <Link to="/single" state={item}>
            <button className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              View
            </button>
          </Link>
          <Likes item={item} ></Likes>
          <Comment item={item} />
          <div className="align-center flex justify-center">
            <button className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <Link to="/single" state={item}>
                View Comments
              </Link>
            </button>
          </div>
          {user &&
            (user.user_id === item.user_id || user.level_name === 'Admin') && (
              <>
                <button
                  className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => console.log('modify', item)}
                >
                  Modify
                </button>
                <button
                  className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={deleteHandler}
                >
                  Delete
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
};
export default MediaRow;
