import { BlogType, BlogDropdownType } from '.';

export interface LikeType {
  id: number;
  blog: BlogType;
}

export interface LikeFormModalType {
  blog: BlogDropdownType;
}

export interface LikeListItemType {
  id: number;
  blog: BlogDropdownType;
}

export interface LikeListType {
  result: LikeListItemType[];
  total: number;
}

export interface LikeDropdownType {
  id: number;
}

export interface CreateOrUpdateLikeType {
  blogId: number;
}
