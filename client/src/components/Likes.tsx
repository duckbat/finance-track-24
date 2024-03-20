/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useReducer} from 'react';
import {Like, MediaItemWithOwner} from '../types/DBTypes';
import {useLike} from '../hooks/graphQLHooks';

type LikeState = {
  count: number;
  userLike: Like | null;
};

type LikeAction = {
  type: 'setLikeCount' | 'like';
  count?: number;
  like?: Like | null;
};

const likeInitialState: LikeState = {
  count: 0,
  userLike: null,
};

const likeReducer = (state: LikeState, action: LikeAction): LikeState => {
  switch (action.type) {
    case 'setLikeCount':
      return {...state, count: action.count ?? 0};
    case 'like':
      if (action.like !== undefined) {
        return {...state, userLike: action.like};
      }
      return state; // no change if action.like is undefined
  }
  return state; // Return the unchanged state if the action type is not recognized
};

const Likes = ({item}: {item: MediaItemWithOwner}) => {
  const [likeState, likeDispatch] = useReducer(likeReducer, likeInitialState);
  const {getUserLike, getCountByMediaId, postLike, deleteLike} = useLike();

  // get user like
  const getLikes = async () => {
    const token = localStorage.getItem('token');
    if (!item || !token) {
      return;
    }
    try {
      const userLike = await getUserLike(Number(item.media_id), token);
      likeDispatch({type: 'like', like: userLike});
    } catch (e) {
      likeDispatch({type: 'like', like: null});
      // FAKE like object for testing only
      //likeDispatch({type: 'like', like: {like_id: 3, media_id: 5, user_id: 3, created_at: new Date()}});
      console.log('get user like error', (e as Error).message);
    }
  };

  // get like count
  const getLikeCount = async () => {
    try {
      const countResponse = await getCountByMediaId(Number(item.media_id));
      likeDispatch({type: 'setLikeCount', count: countResponse.count});
    } catch (e) {
      likeDispatch({type: 'setLikeCount', count: 0});
      console.log('get user like error', (e as Error).message);
    }
  };

  useEffect(() => {
    getLikes();
    getLikeCount();
  }, [item]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!item || !token) {
        return;
      }
      // If user has liked the media, delete the like. Otherwise, post the like.
      if (likeState.userLike) {
        // delete the like and dispatch the new like count to the state.
        await deleteLike(Number(likeState.userLike.like_id), token);
        // Dispatching is already done in the getLikes and getLikeCount functions.
        // other way, is to do update locally after succesfull api call
        // for deleting it's ok because there is no need to get any data from the api
        likeDispatch({type: 'setLikeCount', count: likeState.count - 1});
        likeDispatch({type: 'like', like: null});
      } else {
        // post the like and dispatch the new like count to the state. Dispatching is already done in the getLikes and getLikeCount functions.
        await postLike(Number(item.media_id), token);
        getLikes();
        getLikeCount();
      }
    } catch (e) {
      console.log('like error', (e as Error).message);
    }
  };

  console.log(likeState);

  return (
    <>
      <div className="flex items-center">
        <span className="mr-2">{likeState.count}</span>
        <button onClick={handleLike}>
      <svg
        className={`h-6 w-6 ${likeState.userLike ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
      </svg>
        </button>
      </div>
    </>
  );
};

export default Likes;
