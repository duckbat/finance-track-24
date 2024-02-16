import {GraphQLError} from 'graphql';
import {
  fetchAllComments,
  fetchCommentsByMediaId,
  fetchCommentsCountByMediaId,
  fetchCommentsByUserId,
  postComment,
  updateComment,
  deleteComment,
} from '../models/commentModel';
import {MyContext} from '../../local-types';

export default {
  MediaItem: {
    comments: async (parent: {media_id: string}) => {
      return await fetchCommentsByMediaId(Number(parent.media_id));
    },
    comments_count: async (parent: {media_id: string}) => {
      return await fetchCommentsCountByMediaId(Number(parent.media_id));
    },
  },
  Query: {
    comments: async () => {
      return await fetchAllComments();
    },
    commentsByMediaID: async (_parent: undefined, args: {media_id: string}) => {
      return await fetchCommentsByMediaId(Number(args.media_id));
    },
    myComments: async (
      _parent: undefined,
      _args: undefined,
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await fetchCommentsByUserId(Number(context.user.user_id));
    },
  },
  Mutation: {
    deleteComment: async (
      _parent: undefined,
      args: {comment_id: string},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await deleteComment(
        Number(args.comment_id),
        Number(context.user.user_id),
        context.user.level_name,
      );
    },
    updateComment: async (
      _parent: undefined,
      args: {comment_text: string; comment_id: string},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await updateComment(
        args.comment_text,
        Number(args.comment_id),
        context.user.user_id,
        context.user.level_name,
      );
    },
    createComment: async (
      _parent: undefined,
      args: {comment_text: string; media_id: string},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await postComment(
        Number(args.media_id),
        context.user.user_id,
        args.comment_text,
      );
    },
  },
};
