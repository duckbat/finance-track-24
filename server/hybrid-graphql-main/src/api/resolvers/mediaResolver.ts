import {
  deleteMedia,
  fetchAllMedia,
  fetchHighestRatedMedia,
  fetchMediaById,
  fetchMostLikedMedia,
  postMedia,
  putMedia,
} from '../models/mediaModel';
import {MediaItem} from '@sharedTypes/DBTypes';
import {MyContext} from '../../local-types';
import {GraphQLError} from 'graphql';
import {fetchFilesByTagById} from '../models/tagModel';

export default {
  Like: {
    media: async (parent: {media_id: string}) => {
      return await fetchMediaById(Number(parent.media_id));
    },
  },
  Rating: {
    media: async (parent: {media_id: string}) => {
      return await fetchMediaById(Number(parent.media_id));
    },
  },
  Query: {
    mediaItems: async () => {
      return await fetchAllMedia();
    },
    mediaItem: async (_parent: undefined, args: {media_id: string}) => {
      return await fetchMediaById(Number(args.media_id));
    },
    mediaItemsByTag: async (_parent: undefined, args: {tag_id: string}) => {
      const result = await fetchFilesByTagById(Number(args.tag_id));
      console.log(result);
      return result;
    },
    myMediaItems: async (
      _parent: undefined,
      _args: undefined,
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await fetchMediaById(Number(context.user.user_id));
    },
    mostLikedMediaItem: async () => {
      return await fetchMostLikedMedia();
    },
    mostRatedMediaItem: async () => {
      return await fetchHighestRatedMedia();
    },
  },
  Mutation: {
    createMediaItem: async (
      _parent: undefined,
      args: {input: Omit<MediaItem, 'media_id' | 'created_at' | 'thumbnail'>},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await postMedia(args.input);
    },
    updateMediaItem: async (
      _parent: undefined,
      args: {media_id: string; input: MediaItem},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      return await putMedia(
        args.input,
        Number(args.media_id),
        context.user.user_id,
        context.user.level_name,
      );
    },
    deleteMediaItem: async (
      _parent: undefined,
      args: {media_id: string},
      context: MyContext,
    ) => {
      if (!context.user || !context.user.user_id || !context.user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await deleteMedia(
        Number(args.media_id),
        Number(context.user.user_id),
        context.user.token,
        context.user.level_name,
      );
    },
  },
};
