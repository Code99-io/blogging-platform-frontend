import { useQuery } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router-dom';

import { appRoutes, common } from '../../../constants';
import { cookies } from '../../../utils';
import { PageLoader } from '../../ui';

const UnAuthenticateGuard = () => {
  const { data: token, isFetching } = useQuery(
    [common.KEY_ACCESS_TOKEN],
    () => cookies.get(common.KEY_ACCESS_TOKEN) || null,
  );

  if (isFetching) {
    return <PageLoader />;
  } else {
    if (!token) {
      return <Outlet />;
    } else {
      return <Navigate to={appRoutes.HOME} />;
    }
  }
};

export default UnAuthenticateGuard;
