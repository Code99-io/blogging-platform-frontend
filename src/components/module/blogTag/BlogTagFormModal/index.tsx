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
  CreateOrUpdateBlogTagType,
  BlogTagType,
  BlogTagFormModalType,
  BlogDropdownType,
  BlogType,
  TagDropdownType,
  TagType,
} from '../../../../types';

import {
  useCreateBlogTag,
  useUpdateBlogTag,
  useGetBlogTag,
  useRefreshBlogTags,
  useGetBlogDropdown,
  useGetTagDropdown,
} from '../../../../queries';

import { ModalWithTitle } from '../../../ui';

import { BlogFormModal } from '../..';
import { TagFormModal } from '../..';
import { useUpdateEffect } from '../../../../hook';

export interface BlogTagFormModalProps {
  open: boolean;
  onClose: (blogTag?: BlogTagType) => void;
  id?: number;
}

const BlogTagSchema = yup
  .object<BlogTagFormModalType>()
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
    tag: yup
      .object()
      .shape({
        id: yup
          .number()
          .test(
            'not-equal-to-negative-one',
            'Please select a Tag',
            (value) => value !== -1,
          )
          .required('Tag is required'),
        name: yup.string().required(),
      })
      .required(),
  })
  .required();

const BlogTagFormModal: React.FC<BlogTagFormModalProps> = ({
  open,
  onClose,
  id,
}) => {
  const isEdit = !!id;

  const { enqueueSnackbar } = useSnackbar();

  const createBlogTagMutation = useCreateBlogTag();
  const updateBlogTagMutation = useUpdateBlogTag(id);
  const refreshBlogTags = useRefreshBlogTags();

  const [blogSearchText, setBlogSearchText] = useState('');
  const [blogFormModal, setBlogModal] = useState(false);

  const [tagSearchText, setTagSearchText] = useState('');
  const [tagFormModal, setTagModal] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm<BlogTagFormModalType>({
    resolver: yupResolver(BlogTagSchema),
  });

  const {
    data: blogTagData,
    isFetching: isBlogTagDataFetching,
    remove,
  } = useGetBlogTag(id);

  const {
    data: blogList,
    refetch: blogRefetch,
    isFetching: isBlogFetching,
  } = useGetBlogDropdown(blogSearchText);

  const {
    data: tagList,
    refetch: tagRefetch,
    isFetching: isTagFetching,
  } = useGetTagDropdown(tagSearchText);

  useEffect(() => {
    if (blogTagData) {
      setValue('blog', {
        id: blogTagData.blog.id,
        title: blogTagData.blog.title,
      });
      setValue('tag', {
        id: blogTagData.tag.id,
        name: blogTagData.tag.name,
      });
    }
  }, [blogTagData]);

  const handleCreateOrUpdateBlogTag = (data: BlogTagFormModalType) => {
    const formData: CreateOrUpdateBlogTagType = {
      blogId: data.blog.id,
      tagId: data.tag.id,
    };

    if (isEdit) {
      updateBlogTagMutation.mutate(formData, {
        onSuccess: (updatedData) => {
          enqueueSnackbar('BlogTag updated successfully', {
            variant: 'success',
          });
          refreshBlogTags();
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
      createBlogTagMutation.mutate(formData, {
        onSuccess: (newData) => {
          enqueueSnackbar('BlogTag created successfully', {
            variant: 'success',
          });
          refreshBlogTags();
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

  // Tag MODAL
  const debounceTagSearchText = debounce((value: string) => {
    setTagSearchText(value);
  }, 300);

  const handleTagSearchText = (
    _: any,
    text: string,
    reason: AutocompleteInputChangeReason,
  ) => {
    if (reason === 'input') {
      debounceTagSearchText(text);
    }
  };

  useUpdateEffect(() => {
    tagRefetch();
  }, [tagSearchText]);

  const handleTagModalOpen = () => {
    setTagModal(true);
  };

  const handleTagModalClose = (tag?: TagType) => {
    if (tag) {
      setValue('tag', {
        id: tag.id,
        name: tag.name,
      });
    }

    setTagModal(false);
  };

  const handleTagChange = (
    _: any,
    newValue: string | TagDropdownType | null,
  ) => {
    if (!newValue) {
      // Handle the case where no option is selected
      setValue('tag', {
        id: -1,
        name: '',
      });
    } else if (typeof newValue === 'object') {
      // Check if the selected option exists in the tagList
      setValue('tag', newValue);
    }
    trigger('tag');
  };

  return (
    <>
      <ModalWithTitle
        open={open}
        title="New BlogTag"
        subTitle="Create new BlogTag"
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
          onSubmit: handleSubmit(handleCreateOrUpdateBlogTag),
        }}
        loading={isBlogTagDataFetching}
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
            <Stack direction={'row'} alignItems={'flex-start'} spacing={2}>
              <Autocomplete
                value={getValues('tag') || null}
                options={tagList || []}
                getOptionLabel={(option) =>
                  typeof option === 'object' ? option.name : option
                }
                onChange={handleTagChange}
                onInputChange={handleTagSearchText}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tag"
                    size="small"
                    error={!!errors.tag?.id?.message}
                    helperText={errors.tag?.id?.message}
                  />
                )}
                renderOption={(props, option) => (
                  <ListItem {...props} key={option.id}>
                    {option.name}
                  </ListItem>
                )}
                loading={isTagFetching}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                freeSolo
                forcePopupIcon
                fullWidth
              />
              <IconButton onClick={handleTagModalOpen}>
                <AddIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </ModalWithTitle>
      {blogFormModal && (
        <BlogFormModal open={blogFormModal} onClose={handleBlogModalClose} />
      )}
      {tagFormModal && (
        <TagFormModal open={tagFormModal} onClose={handleTagModalClose} />
      )}
    </>
  );
};

export default BlogTagFormModal;
