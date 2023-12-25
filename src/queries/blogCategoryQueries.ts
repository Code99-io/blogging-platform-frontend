import { useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedMutation, useAuthenticatedQuery } from '../hook';
import queryAsync from '../network/apiClient';
import {
  BlogCategoryDropdownType,
  BlogCategoryListType,
  BlogCategoryType,
} from '../types';

export const useBlogCategories = (
  page: number,
  limit: number = 10,
  search?: string,
) => {
  return useAuthenticatedQuery(['blogCategories', `${page}`], (token) => {
    return queryAsync<BlogCategoryListType>({
      path: `/blogCategories`,
      type: 'GET',
      queryParams: {
        page: page + 1,
        limit,
        ...(search && {
          search,
        }),
      },
      token,
    });
  });
};

export const useCreateBlogCategory = () => {
  return useAuthenticatedMutation(
    ['create-blogCategory'],
    (token: string, params: any) => {
      return queryAsync<BlogCategoryType>({
        path: `/blogCategories`,
        type: 'POST',
        data: { ...params },
        token,
      });
    },
  );
};

export const useDeleteBlogCategory = () => {
  return useAuthenticatedMutation(
    ['delete-blogCategory'],
    (token: string, params: any) => {
      return queryAsync<void>({
        path: `/blogCategories/${params.id}`,
        type: 'DELETE',
        token,
      });
    },
  );
};

export const useUpdateBlogCategory = (id?: number | string) => {
  return useAuthenticatedMutation(
    ['update-blogCategory'],
    (token: string, params: any) => {
      return queryAsync<BlogCategoryType>({
        path: `/blogCategories/${id}`,
        type: 'PUT',
        token,
        data: { ...params },
      });
    },
  );
};

export const useGetBlogCategory = (id?: number) => {
  return useAuthenticatedQuery(
    ['get-blogCategory'],
    (token: string) => {
      return queryAsync<BlogCategoryType>({
        path: `/blogCategories/${id}`,
        type: 'GET',
        token,
      });
    },
    {
      enabled: !!id,
    },
  );
};

export const useGetBlogCategoryDropdown = (keyword?: string) => {
  return useAuthenticatedQuery(['blogCategory-dropdown'], (token: string) => {
    return queryAsync<BlogCategoryDropdownType[]>({
      path: `/blogCategories/dropdown`,
      type: 'GET',
      queryParams: {
        ...(keyword && { keyword }),
      },
      token,
    });
  });
};

export const useRefreshBlogCategories = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['blogCategories'] });
  };
  return refresh;
};
