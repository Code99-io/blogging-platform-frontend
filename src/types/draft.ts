import { BlogType, BlogDropdownType } from '.';

export interface DraftType {
  id: number;
  blog: BlogType;
  content: string;
}

export interface DraftFormModalType {
  blog: BlogDropdownType;
  content: string;
}

export interface DraftListItemType {
  id: number;
  blog: BlogDropdownType;
  content: string;
}

export interface DraftListType {
  result: DraftListItemType[];
  total: number;
}

export interface DraftDropdownType {
  id: number;
}

export interface CreateOrUpdateDraftType {
  blogId: number;
  content: string;
}
