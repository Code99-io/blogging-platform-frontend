import { useState } from 'react';
import debounce from 'debounce';
import { enqueueSnackbar } from 'notistack';

import { CommentFormModal, CommentListView } from '../../../components/module';
import { useDeleteComment, useRefreshComments } from '../../../queries';
import { PageContainer } from '../../../components/ui';
import { DeleteDialog } from '../../../components/action';

const Comments = () => {
  const [openNewFormModal, setOpenNewFormModal] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<number | undefined>();
  const [editCommentId, setEditCommentId] = useState<number | undefined>();

  const [searchText, setSearchText] = useState<string | undefined>();

  const deleteCommentMutation = useDeleteComment();
  const refreshComments = useRefreshComments();

  const handleOpenNewFormModal = () => {
    setOpenNewFormModal(true);
  };

  const handleCloseFormModal = () => {
    setOpenNewFormModal(false);
    setEditCommentId(undefined);
  };

  const onEdit = (id: number) => {
    setEditCommentId(id);
  };

  const onDelete = (id: number) => {
    setDeleteCommentId(id);
  };

  const debounceSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);

  const handleSearch = (text: string) => {
    debounceSearch(text);
  };

  const handleDelete = () => {
    deleteCommentMutation.mutate(
      { id: deleteCommentId },
      {
        onSuccess: () => {
          enqueueSnackbar('Comment deleted successfully', {
            variant: 'success',
          });
          refreshComments();
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
    setDeleteCommentId(undefined);
  };

  const handleDeleteCancel = () => {
    setDeleteCommentId(undefined);
  };

  return (
    <PageContainer
      title="Comments"
      newButtonText="Add New Comment"
      onNewButtonClick={handleOpenNewFormModal}
      onSearch={handleSearch}
    >
      <CommentListView
        onEdit={onEdit}
        onDelete={onDelete}
        search={searchText}
      />
      {(openNewFormModal || !!editCommentId) && (
        <CommentFormModal
          open={openNewFormModal || !!editCommentId}
          onClose={handleCloseFormModal}
          id={editCommentId}
        />
      )}
      {deleteCommentId && (
        <DeleteDialog
          open={!!deleteCommentId}
          onDelete={handleDelete}
          onCancel={handleDeleteCancel}
        />
      )}
    </PageContainer>
  );
};

export default Comments;
