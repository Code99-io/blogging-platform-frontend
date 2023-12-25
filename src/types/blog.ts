export interface BlogType {
  id: number;
  title: string;
  content: string;
  published: boolean;
}

export interface BlogFormModalType {
  title: string;
  content: string;
  published: boolean;
}

export interface BlogListItemType {
  id: number;
  title: string;
  content: string;
  published: boolean;
}

export interface BlogListType {
  result: BlogListItemType[];
  total: number;
}

export interface BlogDropdownType {
  id: number;
  title: string;
}

export interface CreateOrUpdateBlogType {
  title: string;
  content: string;
  published: boolean;
}
