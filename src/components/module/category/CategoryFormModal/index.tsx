import { useEffect } from 'react';
import { Button, Grid, Stack, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import {
  CreateOrUpdateCategoryType,
  CategoryType,
  CategoryFormModalType,
} from '../../../../types';

import {
  useCreateCategory,
  useUpdateCategory,
  useGetCategory,
  useRefreshCategories,
} from '../../../../queries';

import { ModalWithTitle } from '../../../ui';

export interface CategoryFormModalProps {
  open: boolean;
  onClose: (category?: CategoryType) => void;
  id?: number;
}

const CategorySchema = yup
  .object<CategoryFormModalType>()
  .shape({
    name: yup.string().required('Name is required'),
  })
  .required();

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  open,
  onClose,
  id,
}) => {
  const isEdit = !!id;

  const { enqueueSnackbar } = useSnackbar();

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory(id);
  const refreshCategories = useRefreshCategories();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CategoryFormModalType>({
    resolver: yupResolver(CategorySchema),
  });

  const {
    data: categoryData,
    isFetching: isCategoryDataFetching,
    remove,
  } = useGetCategory(id);

  useEffect(() => {
    if (categoryData) {
      setValue('name', categoryData.name);
    }
  }, [categoryData]);

  const handleCreateOrUpdateCategory = (data: CategoryFormModalType) => {
    const formData: CreateOrUpdateCategoryType = {
      name: data.name,
    };

    if (isEdit) {
      updateCategoryMutation.mutate(formData, {
        onSuccess: (updatedData) => {
          enqueueSnackbar('Category updated successfully', {
            variant: 'success',
          });
          refreshCategories();
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
      createCategoryMutation.mutate(formData, {
        onSuccess: (newData) => {
          enqueueSnackbar('Category created successfully', {
            variant: 'success',
          });
          refreshCategories();
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
        title="New Category"
        subTitle="Create new Category"
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
          onSubmit: handleSubmit(handleCreateOrUpdateCategory),
        }}
        loading={isCategoryDataFetching}
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

export default CategoryFormModal;
