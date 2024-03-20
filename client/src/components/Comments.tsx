/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useRef} from 'react';
import {useUserContext} from '../hooks/ContextHooks';
import {useForm} from '../hooks/formHooks';
import {useCommentStore} from '../store';
import {MediaItemWithOwner} from '../types/DBTypes';
import {useComment} from '../hooks/graphQLHooks';

const Comments = ({item}: {item: MediaItemWithOwner}) => {
  const {comments, setComments} = useCommentStore();
  const {user} = useUserContext();
  const formRef = useRef<HTMLFormElement>(null);
  const {getCommentsByMediaId, postComment} = useComment();

  const initValues = {comment_text: ''};

  const doComment = async () => {
    const token = localStorage.getItem('token');
    if (!user || !token) {
      return;
    }
    try {
      await postComment(inputs.comment_text, Number(item.media_id), token);
      await getComments();
      // resetoi lomake
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('postComment failed', error);
    }
  };

  const {handleSubmit, handleInputChange, inputs} = useForm(
    doComment,
    initValues,
  );

  const getComments = async () => {
    try {
      if (!item || !item.media_id) {
        console.error('Item or item.media_id is null or undefined');
        return;
      }
      const comments = await getCommentsByMediaId(Number(item.media_id));
      setComments(comments);
    } catch (error) {
      console.error('getComments failed', error);
      setComments([]);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <>
      {user && (
        <>
          <form onSubmit={handleSubmit} ref={formRef}>
            <div className="flex-end">
              <label className="w-1/3 p-6 text-end" htmlFor="comment">
                Comment:
              </label>
              <input
                className="m-3 w-2/3 rounded-md border border-slate-500 p-3 text-slate-950"
                name="comment_text"
                type="text"
                id="comment"
                placeholder="Enter your comment here..."
                onChange={handleInputChange}
              />
              <button
                className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="submit"
              >
                Post
              </button>
            </div>
          </form>
        </>
      )}
      {comments.length > 0 && (
        <>
          <h3 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Comments</h3>
          <ul className="dark:text-black">
            {comments.map((comment) => (
              <li key={comment.comment_id}>
                <div className="rounded-md border border-black bg-white p-3 mb-2">
                  <span className="font-bold ">
                    On{' '}
                    {new Date(comment.created_at!).toLocaleDateString('fi-FI')}{' '}
                  </span>
                  <span className="font-bold text-slate-500">
                    {comment.username} wrote:
                  </span>
                  <span className="ml-2">{comment.comment_text}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Comments;
