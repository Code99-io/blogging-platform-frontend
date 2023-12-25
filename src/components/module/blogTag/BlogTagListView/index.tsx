import { useEffect, useState } from 'react';

import { useBlogTags } from '../../../../queries';
import { BlogTagListItemType } from '../../../../types';
import { DataGrid, DataGridProps } from '../../../ui';
import { GridAction } from '../../../action';

export interface BlogTagListViewType {
  search?: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const BlogTagListView: React.FC<BlogTagListViewType> = ({
  search,
  onEdit,
  onDelete,
}) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const { data, refetch, isFetching, isError, error } = useBlogTags(
    page,
    pageSize,
    search,
  );

  const columns: DataGridProps<BlogTagListItemType>['columns'] = [
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
      key: 'tag',
      name: 'Tag',
      renderCell: ({ row }) => {
        return <div>{row.tag.name}</div>;
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

export default BlogTagListView;
