import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { common } from '../constants';

interface AuthenticatedMutationOptions<TData, TError, TParam>
  extends UseMutationOptions<TData, TError, void, unknown> {
  params?: TParam;
}

export default function useAuthenticatedMutation<
  TData = any,
  TError = any,
  TParam = any,
>(
  queryKey: string[],
  queryFn: (token: string, params?: TParam) => Promise<TData>,
  config?: AuthenticatedMutationOptions<TData, TError, TParam>,
): UseMutationResult<TData, TError, any, unknown> {
  const queryClient = useQueryClient();
  const token =
    queryClient.getQueryData<string>([common.KEY_ACCESS_TOKEN]) || '';

  return useMutation<TData, TError>(
    queryKey,
    (params?: any) => queryFn(token, params),
    {
      ...config,
    },
  );
}
