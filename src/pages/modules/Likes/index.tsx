import { useState } from 'react';
import debounce from 'debounce';
import { enqueueSnackbar } from 'notistack';

import { LikeFormModal, LikeListView } from '../../../components/module';
import { useDeleteLike, useRefreshLikes } from '../../../queries';
import { PageContainer } from '../../../components/ui';
import { DeleteDialog } from '../../../components/action';

const Likes = () => {
  const [openNewFormModal, setOpenNewFormModal] = useState(false);
  const [deleteLikeId, setDeleteLikeId] = useState<number | undefined>();
  const [editLikeId, setEditLikeId] = useState<number | undefined>();

  const [searchText, setSearchText] = useState<string | undefined>();

  const deleteLikeMutation = useDeleteLike();
  const refreshLikes = useRefreshLikes();

  const handleOpenNewFormModal = () => {
    setOpenNewFormModal(true);
  };

  const handleCloseFormModal = () => {
    setOpenNewFormModal(false);
    setEditLikeId(undefined);
  };

  const onEdit = (id: number) => {
    setEditLikeId(id);
  };

  const onDelete = (id: number) => {
    setDeleteLikeId(id);
  };

  const debounceSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);

  const handleSearch = (text: string) => {
    debounceSearch(text);
  };

  const handleDelete = () => {
    deleteLikeMutation.mutate(
      { id: deleteLikeId },
      {
        onSuccess: () => {
          enqueueSnackbar('Like deleted successfully', { variant: 'success' });
          refreshLikes();
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
    setDeleteLikeId(undefined);
  };

  const handleDeleteCancel = () => {
    setDeleteLikeId(undefined);
  };

  return (
    <PageContainer
      title="Likes"
      newButtonText="Add New Like"
      onNewButtonClick={handleOpenNewFormModal}
      onSearch={handleSearch}
    >
      <LikeListView onEdit={onEdit} onDelete={onDelete} search={searchText} />
      {(openNewFormModal || !!editLikeId) && (
        <LikeFormModal
          open={openNewFormModal || !!editLikeId}
          onClose={handleCloseFormModal}
          id={editLikeId}
        />
      )}
      {deleteLikeId && (
        <DeleteDialog
          open={!!deleteLikeId}
          onDelete={handleDelete}
          onCancel={handleDeleteCancel}
        />
      )}
    </PageContainer>
  );
};

export default Likes;
