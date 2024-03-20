/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useRef} from 'react';
import {useUserContext} from '../hooks/ContextHooks';
import {useForm} from '../hooks/formHooks';
import {useCommentStore} from '../store';
import {MediaItemWithOwner} from '../types/DBTypes';
import {useComment} from '../hooks/graphQLHooks';


const Comment = ({item}: {item: MediaItemWithOwner}) => {
  const { setComments} = useCommentStore();
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
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                type="submit"
              >
                Post
              </button>
            </div>
          </form>
        </>
      )}
    </>
  );

};

export default Comment;
