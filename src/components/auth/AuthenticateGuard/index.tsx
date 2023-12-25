import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router-dom';
import { cookies } from '../../../utils';
import { appRoutes, common } from '../../../constants';
import { useMyAccount, useRefreshToken } from '../../../queries';
import { PageLoader } from '../../ui';

const AuthenticateGuard = () => {
  const queryClient = useQueryClient();

  const token = cookies.get(common.KEY_ACCESS_TOKEN) || null;

  const { isFetching, isSuccess, isError, isRefetching } =
    useMyAccount(!!token);

  const {
    isFetching: isFetchingOnRefreshToken,
    isError: isErrorOnRefreshToken,
    isSuccess: isSuccessOnRefreshToken,
    refetch: refreshToken,
    data: refreshTokenData,
  } = useRefreshToken(false);

  useEffect(() => {
    if (isError) {
      refreshToken();
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccessOnRefreshToken && refreshTokenData) {
      queryClient.setQueryData(
        [common.KEY_ACCESS_TOKEN],
        () => refreshTokenData.accessToken,
      );
      cookies.set(common.KEY_ACCESS_TOKEN, refreshTokenData.accessToken);
      queryClient.setQueryData(
        [common.KEY_REFRESH_TOKEN],
        () => refreshTokenData.refreshToken,
      );
      cookies.set(common.KEY_REFRESH_TOKEN, refreshTokenData.refreshToken);
    } else if (isErrorOnRefreshToken) {
      queryClient.removeQueries([common.KEY_ACCESS_TOKEN]);
      cookies.remove(common.KEY_ACCESS_TOKEN);
      queryClient.removeQueries([common.KEY_REFRESH_TOKEN]);
      cookies.remove(common.KEY_REFRESH_TOKEN);
    }
  }, [isSuccessOnRefreshToken, isErrorOnRefreshToken]);

  if ((isFetching || isFetchingOnRefreshToken) && !isRefetching) {
    return <PageLoader />;
  } else {
    if (isSuccess) {
      return <Outlet />;
    } else {
      return <Navigate to={appRoutes.LOGIN} />;
    }
  }
};

export default AuthenticateGuard;
