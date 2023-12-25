import { BlogType, BlogDropdownType } from '.';
import { TagType, TagDropdownType } from '.';

export interface BlogTagType {
  id: number;
  blog: BlogType;
  tag: TagType;
}

export interface BlogTagFormModalType {
  blog: BlogDropdownType;
  tag: TagDropdownType;
}

export interface BlogTagListItemType {
  id: number;
  blog: BlogDropdownType;
  tag: TagDropdownType;
}

export interface BlogTagListType {
  result: BlogTagListItemType[];
  total: number;
}

export interface BlogTagDropdownType {
  id: number;
}

export interface CreateOrUpdateBlogTagType {
  blogId: number;
  tagId: number;
}
