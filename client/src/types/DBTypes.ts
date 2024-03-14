// Type definitions for database tables and their relationships
// "Convert to GraphQL"

type UserLevel = {
  level_id: string;
  level_name: 'Admin' | 'User' | 'Guest';
};

type User = {
  user_id: string;
  username: string;
  password: string;
  email: string;
  user_level_id: number;
  profile_pic: string | null;
  level_id ?: number;
  created_at: Date | string;
};

type Transaction = {
  transaction_id: string;
  user_id: string;
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
  comment_id: string;
  transaction_id: string;
  user_id: string;
  comment_text: string;
  created_at: Date;
};

type Like = {
  like_id: string;
  transaction_id: string;
  user_id: string;
  created_at: Date;
};

type Rating = {
  rating_id: string;
  transaction_id: string;
  user_id: string;
  rating_value: number;
  created_at: Date;
};

type Category = {
  category_id: string;
  category_name: string;
  icon: string;
};

type TransactionCategory = {
  transaction_id: string;
  tag_id: string;
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
