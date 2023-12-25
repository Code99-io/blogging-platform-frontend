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
  CreateOrUpdateBlogCategoryType,
  BlogCategoryType,
  BlogCategoryFormModalType,
  BlogDropdownType,
  BlogType,
  CategoryDropdownType,
  CategoryType,
} from '../../../../types';

import {
  useCreateBlogCategory,
  useUpdateBlogCategory,
  useGetBlogCategory,
  useRefreshBlogCategories,
  useGetBlogDropdown,
  useGetCategoryDropdown,
} from '../../../../queries';

import { ModalWithTitle } from '../../../ui';

import { BlogFormModal } from '../..';
import { CategoryFormModal } from '../..';
import { useUpdateEffect } from '../../../../hook';

export interface BlogCategoryFormModalProps {
  open: boolean;
  onClose: (blogCategory?: BlogCategoryType) => void;
  id?: number;
}

const BlogCategorySchema = yup
  .object<BlogCategoryFormModalType>()
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
    category: yup
      .object()
      .shape({
        id: yup
          .number()
          .test(
            'not-equal-to-negative-one',
            'Please select a Category',
            (value) => value !== -1,
          )
          .required('Category is required'),
        name: yup.string().required(),
      })
      .required(),
  })
  .required();

const BlogCategoryFormModal: React.FC<BlogCategoryFormModalProps> = ({
  open,
  onClose,
  id,
}) => {
  const isEdit = !!id;

  const { enqueueSnackbar } = useSnackbar();

  const createBlogCategoryMutation = useCreateBlogCategory();
  const updateBlogCategoryMutation = useUpdateBlogCategory(id);
  const refreshBlogCategories = useRefreshBlogCategories();

  const [blogSearchText, setBlogSearchText] = useState('');
  const [blogFormModal, setBlogModal] = useState(false);

  const [categorySearchText, setCategorySearchText] = useState('');
  const [categoryFormModal, setCategoryModal] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm<BlogCategoryFormModalType>({
    resolver: yupResolver(BlogCategorySchema),
  });

  const {
    data: blogCategoryData,
    isFetching: isBlogCategoryDataFetching,
    remove,
  } = useGetBlogCategory(id);

  const {
    data: blogList,
    refetch: blogRefetch,
    isFetching: isBlogFetching,
  } = useGetBlogDropdown(blogSearchText);

  const {
    data: categoryList,
    refetch: categoryRefetch,
    isFetching: isCategoryFetching,
  } = useGetCategoryDropdown(categorySearchText);

  useEffect(() => {
    if (blogCategoryData) {
      setValue('blog', {
        id: blogCategoryData.blog.id,
        title: blogCategoryData.blog.title,
      });
      setValue('category', {
        id: blogCategoryData.category.id,
        name: blogCategoryData.category.name,
      });
    }
  }, [blogCategoryData]);

  const handleCreateOrUpdateBlogCategory = (
    data: BlogCategoryFormModalType,
  ) => {
    const formData: CreateOrUpdateBlogCategoryType = {
      blogId: data.blog.id,
      categoryId: data.category.id,
    };

    if (isEdit) {
      updateBlogCategoryMutation.mutate(formData, {
        onSuccess: (updatedData) => {
          enqueueSnackbar('BlogCategory updated successfully', {
            variant: 'success',
          });
          refreshBlogCategories();
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
      createBlogCategoryMutation.mutate(formData, {
        onSuccess: (newData) => {
          enqueueSnackbar('BlogCategory created successfully', {
            variant: 'success',
          });
          refreshBlogCategories();
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

  // Category MODAL
  const debounceCategorySearchText = debounce((value: string) => {
    setCategorySearchText(value);
  }, 300);

  const handleCategorySearchText = (
    _: any,
    text: string,
    reason: AutocompleteInputChangeReason,
  ) => {
    if (reason === 'input') {
      debounceCategorySearchText(text);
    }
  };

  useUpdateEffect(() => {
    categoryRefetch();
  }, [categorySearchText]);

  const handleCategoryModalOpen = () => {
    setCategoryModal(true);
  };

  const handleCategoryModalClose = (category?: CategoryType) => {
    if (category) {
      setValue('category', {
        id: category.id,
        name: category.name,
      });
    }

    setCategoryModal(false);
  };

  const handleCategoryChange = (
    _: any,
    newValue: string | CategoryDropdownType | null,
  ) => {
    if (!newValue) {
      // Handle the case where no option is selected
      setValue('category', {
        id: -1,
        name: '',
      });
    } else if (typeof newValue === 'object') {
      // Check if the selected option exists in the categoryList
      setValue('category', newValue);
    }
    trigger('category');
  };

  return (
    <>
      <ModalWithTitle
        open={open}
        title="New BlogCategory"
        subTitle="Create new BlogCategory"
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
          onSubmit: handleSubmit(handleCreateOrUpdateBlogCategory),
        }}
        loading={isBlogCategoryDataFetching}
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
                value={getValues('category') || null}
                options={categoryList || []}
                getOptionLabel={(option) =>
                  typeof option === 'object' ? option.name : option
                }
                onChange={handleCategoryChange}
                onInputChange={handleCategorySearchText}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    size="small"
                    error={!!errors.category?.id?.message}
                    helperText={errors.category?.id?.message}
                  />
                )}
                renderOption={(props, option) => (
                  <ListItem {...props} key={option.id}>
                    {option.name}
                  </ListItem>
                )}
                loading={isCategoryFetching}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                freeSolo
                forcePopupIcon
                fullWidth
              />
              <IconButton onClick={handleCategoryModalOpen}>
                <AddIcon />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </ModalWithTitle>
      {blogFormModal && (
        <BlogFormModal open={blogFormModal} onClose={handleBlogModalClose} />
      )}
      {categoryFormModal && (
        <CategoryFormModal
          open={categoryFormModal}
          onClose={handleCategoryModalClose}
        />
      )}
    </>
  );
};

export default BlogCategoryFormModal;
