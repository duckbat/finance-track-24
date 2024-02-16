import {GraphQLError} from 'graphql';
import {MyContext} from '../../local-types';
import {
  deleteTag,
  fetchAllTags,
  fetchTagsByMediaId,
  postTag,
} from '../models/tagModel';

export default {
  MediaItem: {
    tags: async (parent: {media_id: string}) => {
      return await fetchTagsByMediaId(Number(parent.media_id));
    },
  },
  Query: {
    tags: async () => {
      return await fetchAllTags();
    },
  },
  Mutation: {
    deleteTag: async (
      _parent: undefined,
      args: {input: string},
      context: MyContext,
    ) => {
      if (!context.user || context.user.level_name !== 'Admin') {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await deleteTag(Number(args.input));
    },
    createTag: async (
      _parent: undefined,
      args: {tag_name: string; media_id: string},
    ) => {
      // capitalize first letter of tag_name because we want all tags to be the same
      // format in the database so we can query them easily and check for duplicates
      args.tag_name =
        args.tag_name.charAt(0).toUpperCase() +
        args.tag_name.slice(1).toLowerCase();
      return await postTag(args.tag_name, Number(args.media_id));
    },
  },
};
