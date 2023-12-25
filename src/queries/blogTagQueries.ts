import { useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedMutation, useAuthenticatedQuery } from '../hook';
import queryAsync from '../network/apiClient';
import { BlogTagDropdownType, BlogTagListType, BlogTagType } from '../types';

export const useBlogTags = (
  page: number,
  limit: number = 10,
  search?: string,
) => {
  return useAuthenticatedQuery(['blogTags', `${page}`], (token) => {
    return queryAsync<BlogTagListType>({
      path: `/blogTags`,
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

export const useCreateBlogTag = () => {
  return useAuthenticatedMutation(
    ['create-blogTag'],
    (token: string, params: any) => {
      return queryAsync<BlogTagType>({
        path: `/blogTags`,
        type: 'POST',
        data: { ...params },
        token,
      });
    },
  );
};

export const useDeleteBlogTag = () => {
  return useAuthenticatedMutation(
    ['delete-blogTag'],
    (token: string, params: any) => {
      return queryAsync<void>({
        path: `/blogTags/${params.id}`,
        type: 'DELETE',
        token,
      });
    },
  );
};

export const useUpdateBlogTag = (id?: number | string) => {
  return useAuthenticatedMutation(
    ['update-blogTag'],
    (token: string, params: any) => {
      return queryAsync<BlogTagType>({
        path: `/blogTags/${id}`,
        type: 'PUT',
        token,
        data: { ...params },
      });
    },
  );
};

export const useGetBlogTag = (id?: number) => {
  return useAuthenticatedQuery(
    ['get-blogTag'],
    (token: string) => {
      return queryAsync<BlogTagType>({
        path: `/blogTags/${id}`,
        type: 'GET',
        token,
      });
    },
    {
      enabled: !!id,
    },
  );
};

export const useGetBlogTagDropdown = (keyword?: string) => {
  return useAuthenticatedQuery(['blogTag-dropdown'], (token: string) => {
    return queryAsync<BlogTagDropdownType[]>({
      path: `/blogTags/dropdown`,
      type: 'GET',
      queryParams: {
        ...(keyword && { keyword }),
      },
      token,
    });
  });
};

export const useRefreshBlogTags = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['blogTags'] });
  };
  return refresh;
};
