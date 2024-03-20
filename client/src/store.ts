import {create} from 'zustand';
import {Comment} from './types/DBTypes';

type CommentWithUsername = Partial<Comment & {username: string}>;

type CommentStore = {
  comments: CommentWithUsername[];
  setComments: (comments: CommentWithUsername[]) => void;
  addComment: (comment: CommentWithUsername) => void;
};

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  setComments: (comments) =>
    set(() => ({
      comments: comments,
    })),
  addComment: (comment) =>
    set((state) => ({
      comments: [
        ...state.comments,
        {
          comment_id: (state.comments.length + 1).toString(),
          comment_text: comment.comment_text,
          user_id: comment.user_id,
          media_id: comment.media_id,
          created_at: new Date(),
          username: comment.username,
        },
      ],
    })),
}));
