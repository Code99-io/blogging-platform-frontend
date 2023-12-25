import { Box, Container, Stack, Typography } from '@mui/material';
import {
  useChangePassword,
  useMyAccount,
  useUpdateMyAccount,
} from '../../../queries';
import { ChangePasswordType, MyAccountType } from '../../../types';
import { CircularProgress } from '../../../components/ui';
import { Alert } from '../../../components/action';
import {
  ChangePasswordFormModal,
  MyAccountFormModal,
} from '../../../components/account';

const MyAccount = () => {
  const { isLoading, data: defaultValues } = useMyAccount(false);
  const updateMyAccountMutation = useUpdateMyAccount();
  const changePasswordMutation = useChangePassword();

  const handleSubmit = (data: MyAccountType) => {
    updateMyAccountMutation.mutate(data);
  };

  const handleChangePassword = (data: ChangePasswordType) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">My Account</Typography>
          </div>
          <Stack spacing={3}>
            {isLoading ? (
              <CircularProgress />
            ) : defaultValues ? (
              <>
                <Alert
                  isError={updateMyAccountMutation.isError}
                  isSuccess={updateMyAccountMutation.isSuccess}
                  error={updateMyAccountMutation.error}
                  successMessage="Account info update successfully"
                />
                <Alert
                  isError={changePasswordMutation.isError}
                  isSuccess={changePasswordMutation.isSuccess}
                  error={changePasswordMutation.error}
                  successMessage="Password Changed successfully"
                />
                <MyAccountFormModal
                  defaultValues={defaultValues}
                  onSubmit={handleSubmit}
                />
                <ChangePasswordFormModal
                  onSubmit={handleChangePassword}
                  isLoading={changePasswordMutation.isLoading}
                />
              </>
            ) : null}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default MyAccount;
