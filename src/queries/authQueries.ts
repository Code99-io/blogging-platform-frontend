import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import queryAsync from '../network/apiClient';
import { useNavigate } from 'react-router-dom';
import { appRoutes, common } from '../constants';
import { ResendVerificationType, ResetPasswordType } from '../types';
import { cookies } from '../utils';

export const useRegister = () => {
  return useMutation<
    string,
    { status: string; errorCode: string; errorMessage: string },
    object,
    unknown
  >((params: object) => {
    return queryAsync<string>({
      path: `/auth/register`,
      type: 'POST',
      data: { ...params },
    });
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<
    { accessToken: string; refreshToken: string },
    { status: string; errorCode: string; errorMessage: string },
    object,
    unknown
  >(
    (params: object) => {
      return queryAsync<{ accessToken: string; refreshToken: string }>({
        path: `/auth/login`,
        type: 'POST',
        data: { ...params },
      });
    },
    {
      onSuccess: (token) => {
        // Handle successful sign in
        // console.log('Login success:', token);

        queryClient.setQueryData(
          [common.KEY_ACCESS_TOKEN],
          () => token.accessToken,
        );
        queryClient.setQueryData(
          [common.KEY_REFRESH_TOKEN],
          () => token.refreshToken,
        );
        cookies.set(common.KEY_ACCESS_TOKEN, token.accessToken);
        cookies.set(common.KEY_REFRESH_TOKEN, token.refreshToken);

        navigate(appRoutes.HOME);
      },
    },
  );
};

export const useSingOut = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(
    ['logout'],
    () => {
      return new Promise<boolean>((resolve) => resolve(true));
    },
    {
      onSuccess: () => {
        queryClient.removeQueries([common.KEY_ACCESS_TOKEN]);
        cookies.remove(common.KEY_ACCESS_TOKEN);
        queryClient.removeQueries([common.KEY_REFRESH_TOKEN]);
        cookies.remove(common.KEY_REFRESH_TOKEN);

        navigate(appRoutes.LOGIN);
      },
    },
  );
};

export const useRefreshToken = (enabled: boolean = true) => {
  return useQuery(
    ['refresh-token'],
    () => {
      const refreshToken = cookies.get(common.KEY_REFRESH_TOKEN);
      if (!refreshToken) {
        return null;
      }
      return queryAsync<{ accessToken: string; refreshToken: string }>({
        path: `/auth/refresh-token`,
        type: 'POST',
        data: { refreshToken },
      });
    },
    {
      enabled,
    },
  );
};

export const useForgotPassword = () => {
  return useMutation<
    string,
    { status: string; errorCode: string; errorMessage: string },
    string,
    unknown
  >((email: string) => {
    return queryAsync<string>({
      path: `/auth/forgot-password`,
      type: 'POST',
      data: { email },
    });
  });
};

export const useResetPassword = () => {
  return useMutation<
    string,
    { status: string; errorCode: string; errorMessage: string },
    ResetPasswordType,
    unknown
  >((params: ResetPasswordType) => {
    return queryAsync<string>({
      path: `/auth/reset-password/${params.resetPasswordToken}`,
      type: 'POST',
      data: {
        password: params.password,
        confirmPassword: params.confirmPassword,
      },
    });
  });
};

export const useVerifyEmail = () => {
  return useMutation<
    string,
    { status: string; errorCode: string; errorMessage: string },
    string,
    unknown
  >((verifyEmailToken: string) => {
    return queryAsync<string>({
      path: `/auth/email-verify/${verifyEmailToken}`,
      type: 'GET',
    });
  });
};

export const useResendVerificationEmail = () => {
  return useMutation<
    string,
    { status: string; errorCode: string; errorMessage: string },
    ResendVerificationType,
    unknown
  >((params: ResendVerificationType) => {
    return queryAsync<string>({
      path: `/auth/resend-verification-email`,
      type: 'POST',
      data: {
        email: params.email,
      },
    });
  });
};
