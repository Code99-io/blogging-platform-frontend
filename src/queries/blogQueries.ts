import { useQueryClient } from '@tanstack/react-query';
import { useAuthenticatedMutation, useAuthenticatedQuery } from '../hook';
import queryAsync from '../network/apiClient';
import { BlogDropdownType, BlogListType, BlogType } from '../types';

export const useBlogs = (page: number, limit: number = 10, search?: string) => {
  return useAuthenticatedQuery(['blogs', `${page}`], (token) => {
    return queryAsync<BlogListType>({
      path: `/blogs`,
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

export const useCreateBlog = () => {
  return useAuthenticatedMutation(
    ['create-blog'],
    (token: string, params: any) => {
      return queryAsync<BlogType>({
        path: `/blogs`,
        type: 'POST',
        data: { ...params },
        token,
      });
    },
  );
};

export const useDeleteBlog = () => {
  return useAuthenticatedMutation(
    ['delete-blog'],
    (token: string, params: any) => {
      return queryAsync<void>({
        path: `/blogs/${params.id}`,
        type: 'DELETE',
        token,
      });
    },
  );
};

export const useUpdateBlog = (id?: number | string) => {
  return useAuthenticatedMutation(
    ['update-blog'],
    (token: string, params: any) => {
      return queryAsync<BlogType>({
        path: `/blogs/${id}`,
        type: 'PUT',
        token,
        data: { ...params },
      });
    },
  );
};

export const useGetBlog = (id?: number) => {
  return useAuthenticatedQuery(
    ['get-blog'],
    (token: string) => {
      return queryAsync<BlogType>({
        path: `/blogs/${id}`,
        type: 'GET',
        token,
      });
    },
    {
      enabled: !!id,
    },
  );
};

export const useGetBlogDropdown = (keyword?: string) => {
  return useAuthenticatedQuery(['blog-dropdown'], (token: string) => {
    return queryAsync<BlogDropdownType[]>({
      path: `/blogs/dropdown`,
      type: 'GET',
      queryParams: {
        ...(keyword && { keyword }),
      },
      token,
    });
  });
};

export const useRefreshBlogs = () => {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['blogs'] });
  };
  return refresh;
};
