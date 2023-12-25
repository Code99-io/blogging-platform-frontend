import { useState } from 'react';
import {
  Button,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import * as s from './styles';
import { LoginType } from '../../../types';
import { useLogin, useResendVerificationEmail } from '../../../queries';
import { appRoutes } from '../../../constants';
import { Alert } from '../../../components/action';

const LoginSchema = yup
  .object<LoginType>()
  .shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  })
  .required();

const Login = () => {
  const defaultValues = {
    email: '',
    password: '',
  };

  const loginMutation = useLogin();
  const resendVerificationEmailMutation = useResendVerificationEmail();

  const [email, setEmail] = useState<string>();
  const [isResendEmailSent, setResendEmailSent] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    defaultValues,
    resolver: yupResolver(LoginSchema),
  });

  const onLogin = (data: LoginType) => {
    loginMutation.mutate(data);
    setEmail(data.email);
    setResendEmailSent(false);
  };

  const handleResend = () => {
    if (email) {
      resendVerificationEmailMutation.mutate({ email });
      setResendEmailSent(true);
    }
  };

  return (
    <s.Container>
      <Typography variant="h4">Login</Typography>
      <s.FormWrapper component="form" onSubmit={handleSubmit(onLogin)}>
        <Controller
          control={control}
          name="email"
          defaultValue={defaultValues.email}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              fullWidth
              label="Email"
              error={!!errors.email?.message}
              helperText={errors.email?.message}
              autoFocus
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
        <Alert
          isError={resendVerificationEmailMutation.isError}
          isSuccess={resendVerificationEmailMutation.isSuccess}
          error={resendVerificationEmailMutation.error}
          successMessage="Email resend successfully"
        />
        {!isResendEmailSent && (
          <Alert
            isError={loginMutation.isError}
            isSuccess={loginMutation.isSuccess}
            error={loginMutation.error}
            action={
              loginMutation.error?.errorCode === 'EMAIL_NOT_VERIFIED' ? (
                <Button color="inherit" size="small" onClick={handleResend}>
                  RESEND EMAIL
                </Button>
              ) : undefined
            }
          />
        )}
        <Stack spacing={2} my={2} alignItems={'center'}>
          <s.LoginButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
          >
            Login
          </s.LoginButton>
        </Stack>
        <Stack
          direction={{
            sm: 'column',
            md: 'row',
          }}
          justifyContent={'space-between'}
        >
          <MuiLink
            component={Link}
            to={appRoutes.FORGOT_PASSWORD}
            underline="none"
          >
            Forgot password?
          </MuiLink>
          <MuiLink component={Link} to={appRoutes.SIGN_UP} underline="none">
            {"Don't have an account? Register"}
          </MuiLink>
        </Stack>
      </s.FormWrapper>
    </s.Container>
  );
};

export default Login;
