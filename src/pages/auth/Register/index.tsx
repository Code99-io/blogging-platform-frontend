import { Grid, TextField, Typography, Link as MuiLink } from '@mui/material';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';

import * as s from './styles';
import { Controller, useForm } from 'react-hook-form';
import { RegisterType } from '../../../types';
import { appRoutes } from '../../../constants';
import { useRegister } from '../../../queries';
import { Alert } from '../../../components/action';

const RegisterSchema = yup.object<RegisterType>().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Enter valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const Register = () => {
  const defaultValues: RegisterType = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterType>({
    defaultValues,
    resolver: yupResolver(RegisterSchema),
  });

  const registerMutation = useRegister();

  const onSingUp = (data: RegisterType) => {
    registerMutation.mutate(
      { ...data },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  return (
    <s.Container>
      <Typography variant="h4">Register</Typography>
      <s.FormWrapper component="form" onSubmit={handleSubmit(onSingUp)}>
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
              margin="normal"
              autoFocus
              fullWidth
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          defaultValue={defaultValues.email}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              fullWidth
              label="Email Address"
              autoComplete="email"
              error={!!errors.email?.message}
              helperText={errors.email?.message}
            />
          )}
        />
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
              type="password"
              error={!!errors.password?.message}
              helperText={errors.password?.message}
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
              type="password"
              error={!!errors.confirmPassword?.message}
              helperText={errors.confirmPassword?.message}
            />
          )}
        />
        {/* <FormControlLabel
          control={<Checkbox value="termsCondition" color="primary" />}
          label="Agree to Terms and Conditions"
        /> */}
        <Alert
          isError={registerMutation.isError}
          isSuccess={registerMutation.isSuccess}
          error={registerMutation.error}
          successMessage="Thank you for registering, please check your email and verify it."
        />
        <s.RegisterButton
          type="submit"
          fullWidth
          variant="contained"
          size="large"
        >
          Register
        </s.RegisterButton>
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

export default Register;
