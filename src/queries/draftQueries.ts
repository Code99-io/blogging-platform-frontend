import { useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedMutation, useAuthenticatedQuery } from '../hook';
import queryAsync from '../network/apiClient';
import { DraftDropdownType, DraftListType, DraftType } from '../types';

export const useDrafts = (
  page: number,
  limit: number = 10,
  search?: string,
) => {
  return useAuthenticatedQuery(['drafts', `${page}`], (token) => {
    return queryAsync<DraftListType>({
      path: `/drafts`,
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

export const useCreateDraft = () => {
  return useAuthenticatedMutation(
    ['create-draft'],
    (token: string, params: any) => {
      return queryAsync<DraftType>({
        path: `/drafts`,
        type: 'POST',
        data: { ...params },
        token,
      });
    },
  );
};

export const useDeleteDraft = () => {
  return useAuthenticatedMutation(
    ['delete-draft'],
    (token: string, params: any) => {
      return queryAsync<void>({
        path: `/drafts/${params.id}`,
        type: 'DELETE',
        token,
      });
    },
  );
};

export const useUpdateDraft = (id?: number | string) => {
  return useAuthenticatedMutation(
    ['update-draft'],
    (token: string, params: any) => {
      return queryAsync<DraftType>({
        path: `/drafts/${id}`,
        type: 'PUT',
        token,
        data: { ...params },
      });
    },
  );
};

export const useGetDraft = (id?: number) => {
  return useAuthenticatedQuery(
    ['get-draft'],
    (token: string) => {
      return queryAsync<DraftType>({
        path: `/drafts/${id}`,
        type: 'GET',
        token,
      });
    },
    {
      enabled: !!id,
    },
  );
};

export const useGetDraftDropdown = (keyword?: string) => {
  return useAuthenticatedQuery(['draft-dropdown'], (token: string) => {
    return queryAsync<DraftDropdownType[]>({
      path: `/drafts/dropdown`,
      type: 'GET',
      queryParams: {
        ...(keyword && { keyword }),
      },
      token,
    });
  });
};

export const useRefreshDrafts = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['drafts'] });
  };
  return refresh;
};
