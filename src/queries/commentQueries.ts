import { useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedMutation, useAuthenticatedQuery } from '../hook';
import queryAsync from '../network/apiClient';
import { CommentDropdownType, CommentListType, CommentType } from '../types';

export const useComments = (
  page: number,
  limit: number = 10,
  search?: string,
) => {
  return useAuthenticatedQuery(['comments', `${page}`], (token) => {
    return queryAsync<CommentListType>({
      path: `/comments`,
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

export const useCreateComment = () => {
  return useAuthenticatedMutation(
    ['create-comment'],
    (token: string, params: any) => {
      return queryAsync<CommentType>({
        path: `/comments`,
        type: 'POST',
        data: { ...params },
        token,
      });
    },
  );
};

export const useDeleteComment = () => {
  return useAuthenticatedMutation(
    ['delete-comment'],
    (token: string, params: any) => {
      return queryAsync<void>({
        path: `/comments/${params.id}`,
        type: 'DELETE',
        token,
      });
    },
  );
};

export const useUpdateComment = (id?: number | string) => {
  return useAuthenticatedMutation(
    ['update-comment'],
    (token: string, params: any) => {
      return queryAsync<CommentType>({
        path: `/comments/${id}`,
        type: 'PUT',
        token,
        data: { ...params },
      });
    },
  );
};

export const useGetComment = (id?: number) => {
  return useAuthenticatedQuery(
    ['get-comment'],
    (token: string) => {
      return queryAsync<CommentType>({
        path: `/comments/${id}`,
        type: 'GET',
        token,
      });
    },
    {
      enabled: !!id,
    },
  );
};

export const useGetCommentDropdown = (keyword?: string) => {
  return useAuthenticatedQuery(['comment-dropdown'], (token: string) => {
    return queryAsync<CommentDropdownType[]>({
      path: `/comments/dropdown`,
      type: 'GET',
      queryParams: {
        ...(keyword && { keyword }),
      },
      token,
    });
  });
};

export const useRefreshComments = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['comments'] });
  };
  return refresh;
};
