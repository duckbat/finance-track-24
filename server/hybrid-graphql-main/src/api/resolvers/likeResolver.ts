import {GraphQLError} from 'graphql';
import {
  deleteLike,
  fetchAllLikes,
  fetchLikesByMediaId,
  fetchLikesByUserId,
  fetchLikesCountByMediaId,
  postLike,
} from '../models/likeModel';
import {MyContext} from '../../local-types';

export default {
  MediaItem: {
    likes: async (parent: {media_id: string}) => {
      return await fetchLikesByMediaId(Number(parent.media_id));
    },
    likes_count: async (parent: {media_id: string}) => {
      return await fetchLikesCountByMediaId(Number(parent.media_id));
    },
  },
  Query: {
    likes: async () => {
      return await fetchAllLikes();
    },
    myLikes: async (
      _parent: undefined,
      _args: undefined,
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await fetchLikesByUserId(Number(context.user.user_id));
    },
  },
  Mutation: {
    deleteLike: async (
      _parent: undefined,
      args: {like_id: string},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await deleteLike(
        Number(args.like_id),
        context.user.user_id,
        context.user.level_name,
      );
    },
    createLike: async (
      _parent: undefined,
      args: {media_id: string},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const user_id = context.user.user_id;
      return await postLike(Number(args.media_id), user_id);
    },
  },
};
