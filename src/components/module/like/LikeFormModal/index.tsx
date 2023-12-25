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
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { debounce } from 'debounce';

import {
  CreateOrUpdateLikeType,
  LikeType,
  LikeFormModalType,
  BlogDropdownType,
  BlogType,
} from '../../../../types';

import {
  useCreateLike,
  useUpdateLike,
  useGetLike,
  useRefreshLikes,
  useGetBlogDropdown,
} from '../../../../queries';

import { ModalWithTitle } from '../../../ui';

import { BlogFormModal } from '../..';
import { useUpdateEffect } from '../../../../hook';

export interface LikeFormModalProps {
  open: boolean;
  onClose: (like?: LikeType) => void;
  id?: number;
}

const LikeSchema = yup
  .object<LikeFormModalType>()
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
  })
  .required();

const LikeFormModal: React.FC<LikeFormModalProps> = ({ open, onClose, id }) => {
  const isEdit = !!id;

  const { enqueueSnackbar } = useSnackbar();

  const createLikeMutation = useCreateLike();
  const updateLikeMutation = useUpdateLike(id);
  const refreshLikes = useRefreshLikes();

  const [blogSearchText, setBlogSearchText] = useState('');
  const [blogFormModal, setBlogModal] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm<LikeFormModalType>({
    resolver: yupResolver(LikeSchema),
  });

  const {
    data: likeData,
    isFetching: isLikeDataFetching,
    remove,
  } = useGetLike(id);

  const {
    data: blogList,
    refetch: blogRefetch,
    isFetching: isBlogFetching,
  } = useGetBlogDropdown(blogSearchText);

  useEffect(() => {
    if (likeData) {
      setValue('blog', {
        id: likeData.blog.id,
        title: likeData.blog.title,
      });
    }
  }, [likeData]);

  const handleCreateOrUpdateLike = (data: LikeFormModalType) => {
    const formData: CreateOrUpdateLikeType = {
      blogId: data.blog.id,
    };

    if (isEdit) {
      updateLikeMutation.mutate(formData, {
        onSuccess: (updatedData) => {
          enqueueSnackbar('Like updated successfully', {
            variant: 'success',
          });
          refreshLikes();
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
      createLikeMutation.mutate(formData, {
        onSuccess: (newData) => {
          enqueueSnackbar('Like created successfully', {
            variant: 'success',
          });
          refreshLikes();
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
        title="New Like"
        subTitle="Create new Like"
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
          onSubmit: handleSubmit(handleCreateOrUpdateLike),
        }}
        loading={isLikeDataFetching}
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
        </Grid>
      </ModalWithTitle>
      {blogFormModal && (
        <BlogFormModal open={blogFormModal} onClose={handleBlogModalClose} />
      )}
    </>
  );
};

export default LikeFormModal;
