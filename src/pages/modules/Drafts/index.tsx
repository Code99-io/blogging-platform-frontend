import { useState } from 'react';
import debounce from 'debounce';
import { enqueueSnackbar } from 'notistack';

import { DraftFormModal, DraftListView } from '../../../components/module';
import { useDeleteDraft, useRefreshDrafts } from '../../../queries';
import { PageContainer } from '../../../components/ui';
import { DeleteDialog } from '../../../components/action';

const Drafts = () => {
  const [openNewFormModal, setOpenNewFormModal] = useState(false);
  const [deleteDraftId, setDeleteDraftId] = useState<number | undefined>();
  const [editDraftId, setEditDraftId] = useState<number | undefined>();

  const [searchText, setSearchText] = useState<string | undefined>();

  const deleteDraftMutation = useDeleteDraft();
  const refreshDrafts = useRefreshDrafts();

  const handleOpenNewFormModal = () => {
    setOpenNewFormModal(true);
  };

  const handleCloseFormModal = () => {
    setOpenNewFormModal(false);
    setEditDraftId(undefined);
  };

  const onEdit = (id: number) => {
    setEditDraftId(id);
  };

  const onDelete = (id: number) => {
    setDeleteDraftId(id);
  };

  const debounceSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);

  const handleSearch = (text: string) => {
    debounceSearch(text);
  };

  const handleDelete = () => {
    deleteDraftMutation.mutate(
      { id: deleteDraftId },
      {
        onSuccess: () => {
          enqueueSnackbar('Draft deleted successfully', { variant: 'success' });
          refreshDrafts();
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
    setDeleteDraftId(undefined);
  };

  const handleDeleteCancel = () => {
    setDeleteDraftId(undefined);
  };

  return (
    <PageContainer
      title="Drafts"
      newButtonText="Add New Draft"
      onNewButtonClick={handleOpenNewFormModal}
      onSearch={handleSearch}
    >
      <DraftListView onEdit={onEdit} onDelete={onDelete} search={searchText} />
      {(openNewFormModal || !!editDraftId) && (
        <DraftFormModal
          open={openNewFormModal || !!editDraftId}
          onClose={handleCloseFormModal}
          id={editDraftId}
        />
      )}
      {deleteDraftId && (
        <DeleteDialog
          open={!!deleteDraftId}
          onDelete={handleDelete}
          onCancel={handleDeleteCancel}
        />
      )}
    </PageContainer>
  );
};

export default Drafts;
