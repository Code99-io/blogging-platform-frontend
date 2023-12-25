import { useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedMutation, useAuthenticatedQuery } from '../hook';
import queryAsync from '../network/apiClient';
import { LikeDropdownType, LikeListType, LikeType } from '../types';

export const useLikes = (page: number, limit: number = 10, search?: string) => {
  return useAuthenticatedQuery(['likes', `${page}`], (token) => {
    return queryAsync<LikeListType>({
      path: `/likes`,
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

export const useCreateLike = () => {
  return useAuthenticatedMutation(
    ['create-like'],
    (token: string, params: any) => {
      return queryAsync<LikeType>({
        path: `/likes`,
        type: 'POST',
        data: { ...params },
        token,
      });
    },
  );
};

export const useDeleteLike = () => {
  return useAuthenticatedMutation(
    ['delete-like'],
    (token: string, params: any) => {
      return queryAsync<void>({
        path: `/likes/${params.id}`,
        type: 'DELETE',
        token,
      });
    },
  );
};

export const useUpdateLike = (id?: number | string) => {
  return useAuthenticatedMutation(
    ['update-like'],
    (token: string, params: any) => {
      return queryAsync<LikeType>({
        path: `/likes/${id}`,
        type: 'PUT',
        token,
        data: { ...params },
      });
    },
  );
};

export const useGetLike = (id?: number) => {
  return useAuthenticatedQuery(
    ['get-like'],
    (token: string) => {
      return queryAsync<LikeType>({
        path: `/likes/${id}`,
        type: 'GET',
        token,
      });
    },
    {
      enabled: !!id,
    },
  );
};

export const useGetLikeDropdown = (keyword?: string) => {
  return useAuthenticatedQuery(['like-dropdown'], (token: string) => {
    return queryAsync<LikeDropdownType[]>({
      path: `/likes/dropdown`,
      type: 'GET',
      queryParams: {
        ...(keyword && { keyword }),
      },
      token,
    });
  });
};

export const useRefreshLikes = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['likes'] });
  };
  return refresh;
};
