import { useEffect, useState } from 'react';
import {
  Autocomplete,
  AutocompleteInputChangeReason,
  Button,
  Grid,
  IconButton,
  ListItem,
  Stack,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { debounce } from 'debounce';

import {
  CreateOrUpdateDraftType,
  DraftType,
  DraftFormModalType,
  BlogDropdownType,
  BlogType,
} from '../../../../types';

import {
  useCreateDraft,
  useUpdateDraft,
  useGetDraft,
  useRefreshDrafts,
  useGetBlogDropdown,
} from '../../../../queries';

import { ModalWithTitle } from '../../../ui';

import { BlogFormModal } from '../..';
import { useUpdateEffect } from '../../../../hook';

export interface DraftFormModalProps {
  open: boolean;
  onClose: (draft?: DraftType) => void;
  id?: number;
}

const DraftSchema = yup
  .object<DraftFormModalType>()
  .shape({
    blog: yup
      .object()
      .shape({
        id: yup
          .number()
          .test(
            'not-equal-to-negative-one',
            'Please select a Blog',
            (value) => value !== -1,
          )
          .required('Blog is required'),
        title: yup.string().required(),
      })
      .required(),
    content: yup.string().required('Content is required'),
  })
  .required();

const DraftFormModal: React.FC<DraftFormModalProps> = ({
  open,
  onClose,
  id,
}) => {
  const isEdit = !!id;

  const { enqueueSnackbar } = useSnackbar();

  const createDraftMutation = useCreateDraft();
  const updateDraftMutation = useUpdateDraft(id);
  const refreshDrafts = useRefreshDrafts();

  const [blogSearchText, setBlogSearchText] = useState('');
  const [blogFormModal, setBlogModal] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm<DraftFormModalType>({
    resolver: yupResolver(DraftSchema),
  });

  const {
    data: draftData,
    isFetching: isDraftDataFetching,
    remove,
  } = useGetDraft(id);

  const {
    data: blogList,
    refetch: blogRefetch,
    isFetching: isBlogFetching,
  } = useGetBlogDropdown(blogSearchText);

  useEffect(() => {
    if (draftData) {
      setValue('blog', {
        id: draftData.blog.id,
        title: draftData.blog.title,
      });
      setValue('content', draftData.content);
    }
  }, [draftData]);

  const handleCreateOrUpdateDraft = (data: DraftFormModalType) => {
    const formData: CreateOrUpdateDraftType = {
      blogId: data.blog.id,
      content: data.content,
    };

    if (isEdit) {
      updateDraftMutation.mutate(formData, {
        onSuccess: (updatedData) => {
          enqueueSnackbar('Draft updated successfully', {
            variant: 'success',
          });
          refreshDrafts();
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
      createDraftMutation.mutate(formData, {
        onSuccess: (newData) => {
          enqueueSnackbar('Draft created successfully', {
            variant: 'success',
          });
          refreshDrafts();
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

  // Blog MODAL
  const debounceBlogSearchText = debounce((value: string) => {
    setBlogSearchText(value);
  }, 300);

  const handleBlogSearchText = (
    _: any,
    text: string,
    reason: AutocompleteInputChangeReason,
  ) => {
    if (reason === 'input') {
      debounceBlogSearchText(text);
    }
  };

  useUpdateEffect(() => {
    blogRefetch();
  }, [blogSearchText]);

  const handleBlogModalOpen = () => {
    setBlogModal(true);
  };

  const handleBlogModalClose = (blog?: BlogType) => {
    if (blog) {
      setValue('blog', {
        id: blog.id,
        title: blog.title,
      });
    }

    setBlogModal(false);
  };

  const handleBlogChange = (
    _: any,
    newValue: string | BlogDropdownType | null,
  ) => {
    if (!newValue) {
      // Handle the case where no option is selected
      setValue('blog', {
        id: -1,
        title: '',
      });
    } else if (typeof newValue === 'object') {
      // Check if the selected option exists in the blogList
      setValue('blog', newValue);
    }
    trigger('blog');
  };

  return (
    <>
      <ModalWithTitle
        open={open}
        title="New Draft"
        subTitle="Create new Draft"
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
          onSubmit: handleSubmit(handleCreateOrUpdateDraft),
        }}
        loading={isDraftDataFetching}
      >
        <Grid container spacing={2}>
          <Grid xs={12} md={12} item>
            <Stack direction={'row'} alignItems={'flex-start'} spacing={2}>
              <Autocomplete
                value={getValues('blog') || null}
                options={blogList || []}
                getOptionLabel={(option) =>
                  typeof option === 'object' ? option.title : option
                }
                onChange={handleBlogChange}
                onInputChange={handleBlogSearchText}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Blog"
                    size="small"
                    error={!!errors.blog?.id?.message}
                    helperText={errors.blog?.id?.message}
                  />
                )}
                renderOption={(props, option) => (
                  <ListItem {...props} key={option.id}>
                    {option.title}
                  </ListItem>
                )}
                loading={isBlogFetching}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                freeSolo
                forcePopupIcon
                fullWidth
              />
              <IconButton onClick={handleBlogModalOpen}>
                <AddIcon />
              </IconButton>
            </Stack>
          </Grid>
          <Grid xs={12} md={12} item>
            <Controller
              control={control}
              name="content"
              defaultValue={''}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  label="Content"
                  error={!!errors.content?.message}
                  helperText={errors.content?.message}
                  size="small"
                  inputProps={{
                    style: {
                      height: 80,
                      overflow: 'scroll',
                    },
                  }}
                  multiline
                  fullWidth
                  autoFocus
                />
              )}
            />
          </Grid>
        </Grid>
      </ModalWithTitle>
      {blogFormModal && (
        <BlogFormModal open={blogFormModal} onClose={handleBlogModalClose} />
      )}
    </>
  );
};

export default DraftFormModal;
