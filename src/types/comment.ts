import { BlogType, BlogDropdownType } from '.';

export interface CommentType {
  id: number;
  blog: BlogType;
  content: string;
}

export interface CommentFormModalType {
  blog: BlogDropdownType;
  content: string;
}

export interface CommentListItemType {
  id: number;
  blog: BlogDropdownType;
  content: string;
}

export interface CommentListType {
  result: CommentListItemType[];
  total: number;
}

export interface CommentDropdownType {
  id: number;
}

export interface CreateOrUpdateCommentType {
  blogId: number;
  content: string;
}
