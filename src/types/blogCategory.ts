import { BlogType, BlogDropdownType } from '.';
import { CategoryType, CategoryDropdownType } from '.';

export interface BlogCategoryType {
  id: number;
  blog: BlogType;
  category: CategoryType;
}

export interface BlogCategoryFormModalType {
  blog: BlogDropdownType;
  category: CategoryDropdownType;
}

export interface BlogCategoryListItemType {
  id: number;
  blog: BlogDropdownType;
  category: CategoryDropdownType;
}

export interface BlogCategoryListType {
  result: BlogCategoryListItemType[];
  total: number;
}

export interface BlogCategoryDropdownType {
  id: number;
}

export interface CreateOrUpdateBlogCategoryType {
  blogId: number;
  categoryId: number;
}
