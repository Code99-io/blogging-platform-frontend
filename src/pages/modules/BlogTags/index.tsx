import { useState } from 'react';
import debounce from 'debounce';
import { enqueueSnackbar } from 'notistack';

import { BlogTagFormModal, BlogTagListView } from '../../../components/module';
import { useDeleteBlogTag, useRefreshBlogTags } from '../../../queries';
import { PageContainer } from '../../../components/ui';
import { DeleteDialog } from '../../../components/action';

const BlogTags = () => {
  const [openNewFormModal, setOpenNewFormModal] = useState(false);
  const [deleteBlogTagId, setDeleteBlogTagId] = useState<number | undefined>();
  const [editBlogTagId, setEditBlogTagId] = useState<number | undefined>();

  const [searchText, setSearchText] = useState<string | undefined>();

  const deleteBlogTagMutation = useDeleteBlogTag();
  const refreshBlogTags = useRefreshBlogTags();

  const handleOpenNewFormModal = () => {
    setOpenNewFormModal(true);
  };

  const handleCloseFormModal = () => {
    setOpenNewFormModal(false);
    setEditBlogTagId(undefined);
  };

  const onEdit = (id: number) => {
    setEditBlogTagId(id);
  };

  const onDelete = (id: number) => {
    setDeleteBlogTagId(id);
  };

  const debounceSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);

  const handleSearch = (text: string) => {
    debounceSearch(text);
  };

  const handleDelete = () => {
    deleteBlogTagMutation.mutate(
      { id: deleteBlogTagId },
      {
        onSuccess: () => {
          enqueueSnackbar('BlogTag deleted successfully', {
            variant: 'success',
          });
          refreshBlogTags();
        },
        onError: (error) => {
          enqueueSnackbar(
            error.errorMessage || 'Something went wrong while delete',
            {
              variant: 'error',
            },
          );
        },
      },
    );
    setDeleteBlogTagId(undefined);
  };

  const handleDeleteCancel = () => {
    setDeleteBlogTagId(undefined);
  };

  return (
    <PageContainer
      title="BlogTags"
      newButtonText="Add New BlogTag"
      onNewButtonClick={handleOpenNewFormModal}
      onSearch={handleSearch}
    >
      <BlogTagListView
        onEdit={onEdit}
        onDelete={onDelete}
        search={searchText}
      />
      {(openNewFormModal || !!editBlogTagId) && (
        <BlogTagFormModal
          open={openNewFormModal || !!editBlogTagId}
          onClose={handleCloseFormModal}
          id={editBlogTagId}
        />
      )}
      {deleteBlogTagId && (
        <DeleteDialog
          open={!!deleteBlogTagId}
          onDelete={handleDelete}
          onCancel={handleDeleteCancel}
        />
      )}
    </PageContainer>
  );
};

export default BlogTags;
