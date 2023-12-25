import { useEffect } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';

import {
  CreateOrUpdateBlogType,
  BlogType,
  BlogFormModalType,
} from '../../../../types';

import {
  useCreateBlog,
  useUpdateBlog,
  useGetBlog,
  useRefreshBlogs,
} from '../../../../queries';

import { ModalWithTitle } from '../../../ui';

export interface BlogFormModalProps {
  open: boolean;
  onClose: (blog?: BlogType) => void;
  id?: number;
}

const BlogSchema = yup
  .object<BlogFormModalType>()
  .shape({
    title: yup.string().required('Title is required'),
    content: yup.string().required('Content is required'),
    published: yup.bool().required('Published is required'),
  })
  .required();

const BlogFormModal: React.FC<BlogFormModalProps> = ({ open, onClose, id }) => {
  const isEdit = !!id;

  const { enqueueSnackbar } = useSnackbar();

  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog(id);
  const refreshBlogs = useRefreshBlogs();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BlogFormModalType>({
    resolver: yupResolver(BlogSchema),
  });

  const {
    data: blogData,
    isFetching: isBlogDataFetching,
    remove,
  } = useGetBlog(id);

  useEffect(() => {
    if (blogData) {
      setValue('title', blogData.title);
      setValue('content', blogData.content);
      setValue('published', blogData.published);
    }
  }, [blogData]);

  const handleCreateOrUpdateBlog = (data: BlogFormModalType) => {
    const formData: CreateOrUpdateBlogType = {
      title: data.title,
      content: data.content,
      published: data.published,
    };

    if (isEdit) {
      updateBlogMutation.mutate(formData, {
        onSuccess: (updatedData) => {
          enqueueSnackbar('Blog updated successfully', {
            variant: 'success',
          });
          refreshBlogs();
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
      createBlogMutation.mutate(formData, {
        onSuccess: (newData) => {
          enqueueSnackbar('Blog created successfully', {
            variant: 'success',
          });
          refreshBlogs();
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
        title="New Blog"
        subTitle="Create new Blog"
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
          onSubmit: handleSubmit(handleCreateOrUpdateBlog),
        }}
        loading={isBlogDataFetching}
      >
        <Grid container spacing={2}>
          <Grid xs={12} md={12} item>
            <Controller
              control={control}
              name="title"
              defaultValue={''}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  error={!!errors.title?.message}
                  helperText={errors.title?.message}
                  size="small"
                  autoFocus
                  fullWidth
                />
              )}
            />
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
          <Grid xs={12} md={12} item>
            <Controller
              name="published"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Published"
                />
              )}
            />
          </Grid>
        </Grid>
      </ModalWithTitle>
    </>
  );
};

export default BlogFormModal;
