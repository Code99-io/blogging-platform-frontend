import { Alert, Grid, Typography, Link as MuiLink } from '@mui/material';
import * as s from './styles';
import { useVerifyEmail } from '../../../queries';
import { appRoutes } from '../../../constants';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const VerifyEmail = () => {
  const { search } = useLocation();
  const emailVerifyToken = new URLSearchParams(search).get('token') || '';

  const emailVerifyMutation = useVerifyEmail();

  useEffect(() => {
    if (emailVerifyToken) {
      emailVerifyMutation.mutate(emailVerifyToken);
    }
  }, [emailVerifyToken]);

  return (
    <s.Container>
      <Typography variant="h4">Verify Email</Typography>
      <s.FormWrapper>
        {emailVerifyMutation.isError && (
          <Alert severity="error">
            {emailVerifyMutation.error.errorMessage}
          </Alert>
        )}
        {emailVerifyMutation.isSuccess && (
          <Alert severity="success">Email Verified Successfully</Alert>
        )}
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

export default VerifyEmail;
