import { useState } from 'react';
import debounce from 'debounce';
import { enqueueSnackbar } from 'notistack';

import {
  CategoryFormModal,
  CategoryListView,
} from '../../../components/module';
import { useDeleteCategory, useRefreshCategories } from '../../../queries';
import { PageContainer } from '../../../components/ui';
import { DeleteDialog } from '../../../components/action';

const Categories = () => {
  const [openNewFormModal, setOpenNewFormModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<
    number | undefined
  >();
  const [editCategoryId, setEditCategoryId] = useState<number | undefined>();

  const [searchText, setSearchText] = useState<string | undefined>();

  const deleteCategoryMutation = useDeleteCategory();
  const refreshCategories = useRefreshCategories();

  const handleOpenNewFormModal = () => {
    setOpenNewFormModal(true);
  };

  const handleCloseFormModal = () => {
    setOpenNewFormModal(false);
    setEditCategoryId(undefined);
  };

  const onEdit = (id: number) => {
    setEditCategoryId(id);
  };

  const onDelete = (id: number) => {
    setDeleteCategoryId(id);
  };

  const debounceSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);

  const handleSearch = (text: string) => {
    debounceSearch(text);
  };

  const handleDelete = () => {
    deleteCategoryMutation.mutate(
      { id: deleteCategoryId },
      {
        onSuccess: () => {
          enqueueSnackbar('Category deleted successfully', {
            variant: 'success',
          });
          refreshCategories();
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
    setDeleteCategoryId(undefined);
  };

  const handleDeleteCancel = () => {
    setDeleteCategoryId(undefined);
  };

  return (
    <PageContainer
      title="Categories"
      newButtonText="Add New Category"
      onNewButtonClick={handleOpenNewFormModal}
      onSearch={handleSearch}
    >
      <CategoryListView
        onEdit={onEdit}
        onDelete={onDelete}
        search={searchText}
      />
      {(openNewFormModal || !!editCategoryId) && (
        <CategoryFormModal
          open={openNewFormModal || !!editCategoryId}
          onClose={handleCloseFormModal}
          id={editCategoryId}
        />
      )}
      {deleteCategoryId && (
        <DeleteDialog
          open={!!deleteCategoryId}
          onDelete={handleDelete}
          onCancel={handleDeleteCancel}
        />
      )}
    </PageContainer>
  );
};

export default Categories;
