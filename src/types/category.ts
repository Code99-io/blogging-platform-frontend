export interface CategoryType {
  id: number;
  name: string;
}

export interface CategoryFormModalType {
  name: string;
}

export interface CategoryListItemType {
  id: number;
  name: string;
}

export interface CategoryListType {
  result: CategoryListItemType[];
  total: number;
}

export interface CategoryDropdownType {
  id: number;
  name: string;
}

export interface CreateOrUpdateCategoryType {
  name: string;
}
