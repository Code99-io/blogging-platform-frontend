import { useQueryClient } from '@tanstack/react-query';
import queryAsync from '../network/apiClient';
import { MyAccountType } from '../types';
import { cookies } from '../utils';
import { useAuthenticatedMutation, useAuthenticatedQuery } from '../hook';

export const useMyAccount = (enabled: boolean = true) => {
  return useAuthenticatedQuery(
    ['my-account'],
    (token) => {
      return queryAsync<MyAccountType>({
        path: `/users/me`,
        type: 'Get',
        token,
      });
    },
    {
      enabled,
    },
  );
};

export const useUpdateMyAccount = () => {
  return useAuthenticatedMutation(['my-account'], (token, params) => {
    return queryAsync<void>({
      path: `/users/me`,
      type: 'PUT',
      data: { ...params },
      token,
    });
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useAuthenticatedMutation(
    ['change-password'],
    (token, params) => {
      return queryAsync<void>({
        path: `/auth/change-password`,
        type: 'PUT',
        data: { ...params },
        token,
      });
    },
    {
      onSuccess: (token) => {
        queryClient.setQueryData(['token'], () => token);
        cookies.set('token', token);
      },
    },
  );
};
