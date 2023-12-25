import { useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedMutation, useAuthenticatedQuery } from '../hook';
import queryAsync from '../network/apiClient';
import { TagDropdownType, TagListType, TagType } from '../types';

export const useTags = (page: number, limit: number = 10, search?: string) => {
  return useAuthenticatedQuery(['tags', `${page}`], (token) => {
    return queryAsync<TagListType>({
      path: `/tags`,
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

export const useCreateTag = () => {
  return useAuthenticatedMutation(
    ['create-tag'],
    (token: string, params: any) => {
      return queryAsync<TagType>({
        path: `/tags`,
        type: 'POST',
        data: { ...params },
        token,
      });
    },
  );
};

export const useDeleteTag = () => {
  return useAuthenticatedMutation(
    ['delete-tag'],
    (token: string, params: any) => {
      return queryAsync<void>({
        path: `/tags/${params.id}`,
        type: 'DELETE',
        token,
      });
    },
  );
};

export const useUpdateTag = (id?: number | string) => {
  return useAuthenticatedMutation(
    ['update-tag'],
    (token: string, params: any) => {
      return queryAsync<TagType>({
        path: `/tags/${id}`,
        type: 'PUT',
        token,
        data: { ...params },
      });
    },
  );
};

export const useGetTag = (id?: number) => {
  return useAuthenticatedQuery(
    ['get-tag'],
    (token: string) => {
      return queryAsync<TagType>({
        path: `/tags/${id}`,
        type: 'GET',
        token,
      });
    },
    {
      enabled: !!id,
    },
  );
};

export const useGetTagDropdown = (keyword?: string) => {
  return useAuthenticatedQuery(['tag-dropdown'], (token: string) => {
    return queryAsync<TagDropdownType[]>({
      path: `/tags/dropdown`,
      type: 'GET',
      queryParams: {
        ...(keyword && { keyword }),
      },
      token,
    });
  });
};

export const useRefreshTags = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['tags'] });
  };
  return refresh;
};
