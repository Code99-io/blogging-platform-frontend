import { useState } from 'react';
import debounce from 'debounce';
import { enqueueSnackbar } from 'notistack';

import { BlogFormModal, BlogListView } from '../../../components/module';
import { useDeleteBlog, useRefreshBlogs } from '../../../queries';
import { PageContainer } from '../../../components/ui';
import { DeleteDialog } from '../../../components/action';

const Blogs = () => {
  const [openNewFormModal, setOpenNewFormModal] = useState(false);
  const [deleteBlogId, setDeleteBlogId] = useState<number | undefined>();
  const [editBlogId, setEditBlogId] = useState<number | undefined>();

  const [searchText, setSearchText] = useState<string | undefined>();

  const deleteBlogMutation = useDeleteBlog();
  const refreshBlogs = useRefreshBlogs();

  const handleOpenNewFormModal = () => {
    setOpenNewFormModal(true);
  };

  const handleCloseFormModal = () => {
    setOpenNewFormModal(false);
    setEditBlogId(undefined);
  };

  const onEdit = (id: number) => {
    setEditBlogId(id);
  };

  const onDelete = (id: number) => {
    setDeleteBlogId(id);
  };

  const debounceSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);

  const handleSearch = (text: string) => {
    debounceSearch(text);
  };

  const handleDelete = () => {
    deleteBlogMutation.mutate(
      { id: deleteBlogId },
      {
        onSuccess: () => {
          enqueueSnackbar('Blog deleted successfully', { variant: 'success' });
          refreshBlogs();
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
    setDeleteBlogId(undefined);
  };

  const handleDeleteCancel = () => {
    setDeleteBlogId(undefined);
  };

  return (
    <PageContainer
      title="Blogs"
      newButtonText="Add New Blog"
      onNewButtonClick={handleOpenNewFormModal}
      onSearch={handleSearch}
    >
      <BlogListView onEdit={onEdit} onDelete={onDelete} search={searchText} />
      {(openNewFormModal || !!editBlogId) && (
        <BlogFormModal
          open={openNewFormModal || !!editBlogId}
          onClose={handleCloseFormModal}
          id={editBlogId}
        />
      )}
      {deleteBlogId && (
        <DeleteDialog
          open={!!deleteBlogId}
          onDelete={handleDelete}
          onCancel={handleDeleteCancel}
        />
      )}
    </PageContainer>
  );
};

export default Blogs;
