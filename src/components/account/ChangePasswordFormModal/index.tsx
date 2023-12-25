import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Stack,
  TextField,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChangePasswordType } from '../../../types';

export interface ChangePasswordFormModalProps {
  onSubmit: (data: ChangePasswordType) => void;
  isLoading: boolean;
}

const ChangePasswordSchema = yup.object<ChangePasswordType>().shape({
  currentPassword: yup.string().required('Current is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

const ChangePasswordFormModal: React.FC<ChangePasswordFormModalProps> = ({
  onSubmit,
  isLoading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordType>({
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  return (
    <Card
      component={'form'}
      onSubmit={handleSubmit(onSubmit)}
      variant="outlined"
    >
      <CardHeader
        subheader="Set new password to your account"
        title="Change Password"
      />
      <Divider />
      <CardContent>
        <Stack spacing={3} sx={{ maxWidth: 400 }}>
          <Controller
            name="currentPassword"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                fullWidth
                label="Current Password"
                {...field}
                error={!!errors.currentPassword?.message}
                helperText={errors.currentPassword?.message}
                type="password"
              />
            )}
          />
          <Controller
            name="newPassword"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                fullWidth
                label="New Password"
                {...field}
                error={!!errors.newPassword?.message}
                helperText={errors.newPassword?.message}
                type="password"
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                fullWidth
                label="Confirm Password"
                {...field}
                error={!!errors.confirmPassword?.message}
                helperText={errors.confirmPassword?.message}
                type="password"
              />
            )}
          />
        </Stack>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        {isLoading ? (
          <CircularProgress size={30} />
        ) : (
          <Button type="submit" variant="contained">
            Update
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default ChangePasswordFormModal;
