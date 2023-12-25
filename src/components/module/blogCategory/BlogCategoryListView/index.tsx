import { useEffect, useState } from 'react';

import { useBlogCategories } from '../../../../queries';
import { BlogCategoryListItemType } from '../../../../types';
import { DataGrid, DataGridProps } from '../../../ui';
import { GridAction } from '../../../action';

export interface BlogCategoryListViewType {
  search?: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const BlogCategoryListView: React.FC<BlogCategoryListViewType> = ({
  search,
  onEdit,
  onDelete,
}) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const { data, refetch, isFetching, isError, error } = useBlogCategories(
    page,
    pageSize,
    search,
  );

  const columns: DataGridProps<BlogCategoryListItemType>['columns'] = [
    {
      key: 'id',
      name: 'Id',
      width: 80,
    },
    {
      key: 'blog',
      name: 'Blog',
      renderCell: ({ row }) => {
        return <div>{row.blog.title}</div>;
      },
    },
    {
      key: 'category',
      name: 'Category',
      renderCell: ({ row }) => {
        return <div>{row.category.name}</div>;
      },
    },
    {
      key: 'actions',
      name: 'Actions',
      width: 80,
      renderCell: ({ row }) => {
        return (
          <GridAction
            onEdit={() => onEdit(row.id)}
            onDelete={() => onDelete(row.id)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    refetch();
  }, [page, pageSize]);

  useEffect(() => {
    setPage(0);
    if (page === 0) {
      refetch();
    }
  }, [search]);

  return (
    <DataGrid
      columns={columns}
      data={data}
      pageState={{
        page,
        setPage,
      }}
      pageSizeState={{
        pageSize,
        setPageSize,
      }}
      isLoading={isFetching}
      isError={isError}
      error={error}
      onReload={refetch}
    />
  );
};

export default BlogCategoryListView;
