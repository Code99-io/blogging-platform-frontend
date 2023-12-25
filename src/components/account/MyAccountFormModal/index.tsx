import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MyAccountType } from '../../../types';

export interface MyAccountFormModalProps {
  defaultValues: MyAccountType;
  onSubmit: (data: MyAccountType) => void;
}

const MyAccountSchema = yup
  .object<MyAccountType>()
  .shape({
    email: yup.string().email().required(),
    name: yup.string().required('Name is required'),
  })
  .required();

const MyAccountFormModal: React.FC<MyAccountFormModalProps> = ({
  defaultValues,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MyAccountType>({
    defaultValues,
    resolver: yupResolver(MyAccountSchema),
  });

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Card variant="outlined">
        <CardHeader
          subheader="Update your profile information"
          title="Profile"
        />
        <Divider />
        <CardContent>
          <Box>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue={defaultValues.email || ''}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      label="Email"
                      {...field}
                      error={!!errors.email?.message}
                      helperText={errors.email?.message}
                      disabled
                    />
                  )}
                />
              </Grid>
              <Grid xs={12} md={6}>
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
                      autoFocus
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button variant="contained" type="submit">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default MyAccountFormModal;
