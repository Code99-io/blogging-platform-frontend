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
  CreateOrUpdateCommentType,
  CommentType,
  CommentFormModalType,
  BlogDropdownType,
  BlogType,
} from '../../../../types';

import {
  useCreateComment,
  useUpdateComment,
  useGetComment,
  useRefreshComments,
  useGetBlogDropdown,
} from '../../../../queries';

import { ModalWithTitle } from '../../../ui';

import { BlogFormModal } from '../..';
import { useUpdateEffect } from '../../../../hook';

export interface CommentFormModalProps {
  open: boolean;
  onClose: (comment?: CommentType) => void;
  id?: number;
}

const CommentSchema = yup
  .object<CommentFormModalType>()
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

const CommentFormModal: React.FC<CommentFormModalProps> = ({
  open,
  onClose,
  id,
}) => {
  const isEdit = !!id;

  const { enqueueSnackbar } = useSnackbar();

  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment(id);
  const refreshComments = useRefreshComments();

  const [blogSearchText, setBlogSearchText] = useState('');
  const [blogFormModal, setBlogModal] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm<CommentFormModalType>({
    resolver: yupResolver(CommentSchema),
  });

  const {
    data: commentData,
    isFetching: isCommentDataFetching,
    remove,
  } = useGetComment(id);

  const {
    data: blogList,
    refetch: blogRefetch,
    isFetching: isBlogFetching,
  } = useGetBlogDropdown(blogSearchText);

  useEffect(() => {
    if (commentData) {
      setValue('blog', {
        id: commentData.blog.id,
        title: commentData.blog.title,
      });
      setValue('content', commentData.content);
    }
  }, [commentData]);

  const handleCreateOrUpdateComment = (data: CommentFormModalType) => {
    const formData: CreateOrUpdateCommentType = {
      blogId: data.blog.id,
      content: data.content,
    };

    if (isEdit) {
      updateCommentMutation.mutate(formData, {
        onSuccess: (updatedData) => {
          enqueueSnackbar('Comment updated successfully', {
            variant: 'success',
          });
          refreshComments();
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
      createCommentMutation.mutate(formData, {
        onSuccess: (newData) => {
          enqueueSnackbar('Comment created successfully', {
            variant: 'success',
          });
          refreshComments();
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
        title="New Comment"
        subTitle="Create new Comment"
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
          onSubmit: handleSubmit(handleCreateOrUpdateComment),
        }}
        loading={isCommentDataFetching}
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

export default CommentFormModal;
