import { useEffect } from 'react';
import { Button, Grid, Stack, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import {
  CreateOrUpdateTagType,
  TagType,
  TagFormModalType,
} from '../../../../types';

import {
  useCreateTag,
  useUpdateTag,
  useGetTag,
  useRefreshTags,
} from '../../../../queries';

import { ModalWithTitle } from '../../../ui';

export interface TagFormModalProps {
  open: boolean;
  onClose: (tag?: TagType) => void;
  id?: number;
}

const TagSchema = yup
  .object<TagFormModalType>()
  .shape({
    name: yup.string().required('Name is required'),
  })
  .required();

const TagFormModal: React.FC<TagFormModalProps> = ({ open, onClose, id }) => {
  const isEdit = !!id;

  const { enqueueSnackbar } = useSnackbar();

  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag(id);
  const refreshTags = useRefreshTags();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TagFormModalType>({
    resolver: yupResolver(TagSchema),
  });

  const {
    data: tagData,
    isFetching: isTagDataFetching,
    remove,
  } = useGetTag(id);

  useEffect(() => {
    if (tagData) {
      setValue('name', tagData.name);
    }
  }, [tagData]);

  const handleCreateOrUpdateTag = (data: TagFormModalType) => {
    const formData: CreateOrUpdateTagType = {
      name: data.name,
    };

    if (isEdit) {
      updateTagMutation.mutate(formData, {
        onSuccess: (updatedData) => {
          enqueueSnackbar('Tag updated successfully', {
            variant: 'success',
          });
          refreshTags();
          remove();
          onClose(updatedData);
        },
        onError: (error) => {
          enqueueSnackbar(error.message || 'Something went wrong', {
            variant: 'error',
          });
          onClose();
        },
      });
    } else {
      createTagMutation.mutate(formData, {
        onSuccess: (newData) => {
          enqueueSnackbar('Tag created successfully', {
            variant: 'success',
          });
          refreshTags();
          onClose(newData);
        },
        onError: (error) => {
          enqueueSnackbar(error.message || 'Something went wrong', {
            variant: 'error',
          });
          onClose();
        },
      });
    }
  };

  const handleCancel = () => {
    if (isEdit) {
      remove();
    }
    onClose();
  };

  return (
    <>
      <ModalWithTitle
        open={open}
        title="New Tag"
        subTitle="Create new Tag"
        renderAction={() => (
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </Stack>
        )}
        form={{
          onSubmit: handleSubmit(handleCreateOrUpdateTag),
        }}
        loading={isTagDataFetching}
      >
        <Grid container spacing={2}>
          <Grid xs={12} md={12} item>
            <Controller
              control={control}
              name="name"
              defaultValue={''}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  error={!!errors.name?.message}
                  helperText={errors.name?.message}
                  size="small"
                  autoFocus
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>
      </ModalWithTitle>
    </>
  );
};

export default TagFormModal;
