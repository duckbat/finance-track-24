// Type definitions for database tables and their relationships
// "Convert to GraphQL"

type UserLevel = {
  level_id: number;
  level_name: 'Admin' | 'User' | 'Guest';
};

type User = {
  user_id: number;
  username: string;
  password: string;
  email: string;
  user_level_id: number;
  profile_pic: string | null;
  level_id ?: number;
  created_at: Date | string;
};

type Transaction = {
  transaction_id: number;
  user_id: number;
  amount: number
  filename: string;
  filesize: number;
  media_type: string;
  title: string;
  description: string | null;
  created_at: Date | string;
  owner: User;
  category?: Category[];
  likes?: Like[];
  likes_count: number;
  comments_count: number;
};

type Comment = {
  comment_id: number;
  media_id: number;
  user_id: number;
  comment_text: string;
  created_at: Date;
};

type Like = {
  like_id: number;
  media_id: number;
  user_id: number;
  created_at: Date;
};

type Rating = {
  rating_id: number;
  media_id: number;
  user_id: number;
  rating_value: number;
  created_at: Date;
};

type Category = {
  category_id: number;
  category_name: number;
  icon: string;
};

type TransactionCategory = {
  media_id: number;
  tag_id: number;
};

type CategoryResult = TransactionCategory & Category;

type UploadResult = {
  message: string;
  data?: {
    image: string;
  };
};

// type gymnastics to get rid of user_level_id from User type and replace it with level_name from UserLevel type
type UserWithLevel = Omit<User, 'user_level_id'> &
  Pick<UserLevel, 'level_name'>;

type UserWithNoPassword = Omit<UserWithLevel, 'password'>;

type TokenContent = Pick<User, 'user_id'> & Pick<UserLevel, 'level_name'>;

type TransactionWithOwner = Transaction & {
  owner: User;
  username: string;
  category?: Category[];
  likes?: Like[];
  rating?: Rating[];
  likes_count: number;
  average_rating?: number;
  comments_count: number;
};

// for upload server
type FileInfo = {
  filename: string;
  user_id: number;
};

export type {
  UserLevel,
  User,
  Transaction,
  Comment,
  Like,
  Rating,
  Category,
  TransactionCategory,
  CategoryResult,
  UploadResult,
  UserWithLevel,
  UserWithNoPassword,
  TokenContent,
  TransactionWithOwner,
  FileInfo,
};
