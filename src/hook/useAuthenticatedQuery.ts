import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { common } from '../constants';
import { cookies } from '../utils';

interface AuthenticatedQueryOptions<TData, TError, TParam>
  extends UseQueryOptions<TData, TError> {
  params?: TParam;
}

export default function useAuthenticatedQuery<
  TData = any,
  TError = any,
  TParam = any,
>(
  queryKey: string[],
  queryFn: (token: string, params?: TParam) => Promise<TData>,
  config?: AuthenticatedQueryOptions<TData, TError, TParam>,
): UseQueryResult<TData, TError> {
  const queryClient = useQueryClient();
  const token =
    queryClient.getQueryData<string>([common.KEY_ACCESS_TOKEN]) ||
    cookies.get(common.KEY_ACCESS_TOKEN) ||
    '';

  return useQuery<TData, TError>(
    queryKey,
    () => queryFn(token, config?.params),
    {
      enabled: !!token,
      refetchOnWindowFocus: false,
      ...config,
    },
  );
}
