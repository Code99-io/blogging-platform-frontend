import { useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedMutation, useAuthenticatedQuery } from '../hook';
import queryAsync from '../network/apiClient';
import { CategoryDropdownType, CategoryListType, CategoryType } from '../types';

export const useCategories = (
  page: number,
  limit: number = 10,
  search?: string,
) => {
  return useAuthenticatedQuery(['categories', `${page}`], (token) => {
    return queryAsync<CategoryListType>({
      path: `/categories`,
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

export const useCreateCategory = () => {
  return useAuthenticatedMutation(
    ['create-category'],
    (token: string, params: any) => {
      return queryAsync<CategoryType>({
        path: `/categories`,
        type: 'POST',
        data: { ...params },
        token,
      });
    },
  );
};

export const useDeleteCategory = () => {
  return useAuthenticatedMutation(
    ['delete-category'],
    (token: string, params: any) => {
      return queryAsync<void>({
        path: `/categories/${params.id}`,
        type: 'DELETE',
        token,
      });
    },
  );
};

export const useUpdateCategory = (id?: number | string) => {
  return useAuthenticatedMutation(
    ['update-category'],
    (token: string, params: any) => {
      return queryAsync<CategoryType>({
        path: `/categories/${id}`,
        type: 'PUT',
        token,
        data: { ...params },
      });
    },
  );
};

export const useGetCategory = (id?: number) => {
  return useAuthenticatedQuery(
    ['get-category'],
    (token: string) => {
      return queryAsync<CategoryType>({
        path: `/categories/${id}`,
        type: 'GET',
        token,
      });
    },
    {
      enabled: !!id,
    },
  );
};

export const useGetCategoryDropdown = (keyword?: string) => {
  return useAuthenticatedQuery(['category-dropdown'], (token: string) => {
    return queryAsync<CategoryDropdownType[]>({
      path: `/categories/dropdown`,
      type: 'GET',
      queryParams: {
        ...(keyword && { keyword }),
      },
      token,
    });
  });
};

export const useRefreshCategories = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };
  return refresh;
};
