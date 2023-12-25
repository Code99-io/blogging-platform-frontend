import {
  Alert,
  Grid,
  TextField,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import * as s from './styles';
import { Controller, useForm } from 'react-hook-form';
import { ResetPasswordType } from '../../../types';
import { useResetPassword } from '../../../queries';
import { appRoutes } from '../../../constants';
import { Link, useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const ResetPasswordSchema = yup.object<ResetPasswordType>().shape({
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const ResetPassword = () => {
  const { search } = useLocation();
  const resetPasswordToken = new URLSearchParams(search).get('token') || '';

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };

  const resetPasswordMutation = useResetPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordType>({
    defaultValues,
    resolver: yupResolver(ResetPasswordSchema),
  });

  const onResetPassword = (data: ResetPasswordType) => {
    resetPasswordMutation.mutate(
      {
        password: data.password,
        confirmPassword: data.confirmPassword,
        resetPasswordToken,
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  return (
    <s.Container>
      <Typography variant="h4">Reset Password</Typography>
      <s.FormWrapper component="form" onSubmit={handleSubmit(onResetPassword)}>
        <Controller
          control={control}
          name="password"
          defaultValue={defaultValues.password}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              fullWidth
              label="Password"
              error={!!errors.password?.message}
              helperText={errors.password?.message}
              type="password"
              autoFocus
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          defaultValue={defaultValues.confirmPassword}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              fullWidth
              label="Confirm Password"
              error={!!errors.confirmPassword?.message}
              helperText={errors.confirmPassword?.message}
              type="password"
            />
          )}
        />
        {resetPasswordMutation.isError && (
          <Alert severity="error">
            {resetPasswordMutation.error.errorMessage}
          </Alert>
        )}
        {resetPasswordMutation.isSuccess && (
          <Alert severity="success">Password reset successfully</Alert>
        )}
        <s.ResetPasswordButton
          type="submit"
          fullWidth
          variant="contained"
          size="large"
        >
          Reset Password
        </s.ResetPasswordButton>
        <Grid container>
          <Grid item xs>
            <MuiLink component={Link} to={appRoutes.LOGIN} underline="none">
              Back to Login
            </MuiLink>
          </Grid>
        </Grid>
      </s.FormWrapper>
    </s.Container>
  );
};

export default ResetPassword;
