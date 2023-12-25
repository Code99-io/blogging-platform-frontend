import { useState } from 'react';
import { SelectCellFormatter } from 'react-data-grid';

import { useBlogs } from '../../../../queries';
import { BlogListItemType } from '../../../../types';
import { DataGrid, DataGridProps } from '../../../ui';
import { GridAction } from '../../../action';
import { useUpdateEffect } from '../../../../hook';

export interface BlogListViewType {
  search?: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const BlogListView: React.FC<BlogListViewType> = ({
  search,
  onEdit,
  onDelete,
}) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const { data, refetch, isFetching, isError, error } = useBlogs(
    page,
    pageSize,
    search,
  );

  const columns: DataGridProps<BlogListItemType>['columns'] = [
    {
      key: 'id',
      name: 'Id',
      width: 80,
    },
    {
      key: 'title',
      name: 'Title',
    },
    {
      key: 'content',
      name: 'Content',
    },
    {
      key: 'published',
      name: 'Published',
      width: 120,
      renderCell: ({ row }) => {
        return (
          <SelectCellFormatter value={row.published} onChange={() => {}} />
        );
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

  useUpdateEffect(() => {
    refetch();
  }, [page, pageSize]);

  useUpdateEffect(() => {
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

export default BlogListView;
