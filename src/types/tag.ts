export interface TagType {
  id: number;
  name: string;
}

export interface TagFormModalType {
  name: string;
}

export interface TagListItemType {
  id: number;
  name: string;
}

export interface TagListType {
  result: TagListItemType[];
  total: number;
}

export interface TagDropdownType {
  id: number;
  name: string;
}

export interface CreateOrUpdateTagType {
  name: string;
}
