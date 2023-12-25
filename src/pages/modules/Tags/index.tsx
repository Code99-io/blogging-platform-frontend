import { useState } from 'react';
import debounce from 'debounce';
import { enqueueSnackbar } from 'notistack';

import { TagFormModal, TagListView } from '../../../components/module';
import { useDeleteTag, useRefreshTags } from '../../../queries';
import { PageContainer } from '../../../components/ui';
import { DeleteDialog } from '../../../components/action';

const Tags = () => {
  const [openNewFormModal, setOpenNewFormModal] = useState(false);
  const [deleteTagId, setDeleteTagId] = useState<number | undefined>();
  const [editTagId, setEditTagId] = useState<number | undefined>();

  const [searchText, setSearchText] = useState<string | undefined>();

  const deleteTagMutation = useDeleteTag();
  const refreshTags = useRefreshTags();

  const handleOpenNewFormModal = () => {
    setOpenNewFormModal(true);
  };

  const handleCloseFormModal = () => {
    setOpenNewFormModal(false);
    setEditTagId(undefined);
  };

  const onEdit = (id: number) => {
    setEditTagId(id);
  };

  const onDelete = (id: number) => {
    setDeleteTagId(id);
  };

  const debounceSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);

  const handleSearch = (text: string) => {
    debounceSearch(text);
  };

  const handleDelete = () => {
    deleteTagMutation.mutate(
      { id: deleteTagId },
      {
        onSuccess: () => {
          enqueueSnackbar('Tag deleted successfully', { variant: 'success' });
          refreshTags();
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
    setDeleteTagId(undefined);
  };

  const handleDeleteCancel = () => {
    setDeleteTagId(undefined);
  };

  return (
    <PageContainer
      title="Tags"
      newButtonText="Add New Tag"
      onNewButtonClick={handleOpenNewFormModal}
      onSearch={handleSearch}
    >
      <TagListView onEdit={onEdit} onDelete={onDelete} search={searchText} />
      {(openNewFormModal || !!editTagId) && (
        <TagFormModal
          open={openNewFormModal || !!editTagId}
          onClose={handleCloseFormModal}
          id={editTagId}
        />
      )}
      {deleteTagId && (
        <DeleteDialog
          open={!!deleteTagId}
          onDelete={handleDelete}
          onCancel={handleDeleteCancel}
        />
      )}
    </PageContainer>
  );
};

export default Tags;
