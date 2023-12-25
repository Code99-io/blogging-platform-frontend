import { useState } from 'react';
import debounce from 'debounce';
import { enqueueSnackbar } from 'notistack';

import {
  BlogCategoryFormModal,
  BlogCategoryListView,
} from '../../../components/module';
import {
  useDeleteBlogCategory,
  useRefreshBlogCategories,
} from '../../../queries';
import { PageContainer } from '../../../components/ui';
import { DeleteDialog } from '../../../components/action';

const BlogCategories = () => {
  const [openNewFormModal, setOpenNewFormModal] = useState(false);
  const [deleteBlogCategoryId, setDeleteBlogCategoryId] = useState<
    number | undefined
  >();
  const [editBlogCategoryId, setEditBlogCategoryId] = useState<
    number | undefined
  >();

  const [searchText, setSearchText] = useState<string | undefined>();

  const deleteBlogCategoryMutation = useDeleteBlogCategory();
  const refreshBlogCategories = useRefreshBlogCategories();

  const handleOpenNewFormModal = () => {
    setOpenNewFormModal(true);
  };

  const handleCloseFormModal = () => {
    setOpenNewFormModal(false);
    setEditBlogCategoryId(undefined);
  };

  const onEdit = (id: number) => {
    setEditBlogCategoryId(id);
  };

  const onDelete = (id: number) => {
    setDeleteBlogCategoryId(id);
  };

  const debounceSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);

  const handleSearch = (text: string) => {
    debounceSearch(text);
  };

  const handleDelete = () => {
    deleteBlogCategoryMutation.mutate(
      { id: deleteBlogCategoryId },
      {
        onSuccess: () => {
          enqueueSnackbar('BlogCategory deleted successfully', {
            variant: 'success',
          });
          refreshBlogCategories();
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
    setDeleteBlogCategoryId(undefined);
  };

  const handleDeleteCancel = () => {
    setDeleteBlogCategoryId(undefined);
  };

  return (
    <PageContainer
      title="BlogCategories"
      newButtonText="Add New BlogCategory"
      onNewButtonClick={handleOpenNewFormModal}
      onSearch={handleSearch}
    >
      <BlogCategoryListView
        onEdit={onEdit}
        onDelete={onDelete}
        search={searchText}
      />
      {(openNewFormModal || !!editBlogCategoryId) && (
        <BlogCategoryFormModal
          open={openNewFormModal || !!editBlogCategoryId}
          onClose={handleCloseFormModal}
          id={editBlogCategoryId}
        />
      )}
      {deleteBlogCategoryId && (
        <DeleteDialog
          open={!!deleteBlogCategoryId}
          onDelete={handleDelete}
          onCancel={handleDeleteCancel}
        />
      )}
    </PageContainer>
  );
};

export default BlogCategories;
