import { Alert as MuiAlert } from '@mui/material';

import { getErrorMessage } from '../../../utils';
import { ErrorType } from '../../../types';

export interface AlertProps {
  isError: boolean;
  error: ErrorType | null;
  isSuccess?: boolean;
  successMessage?: string;
  action?: React.ReactElement;
}

const Alert: React.FC<AlertProps> = ({
  isError,
  error,
  isSuccess,
  successMessage,
  action,
}) => {
  return (
    <>
      {isError && error && (
        <MuiAlert severity="error" action={action}>
          {getErrorMessage(error)}
        </MuiAlert>
      )}
      {isSuccess && successMessage && (
        <MuiAlert severity="success" action={action}>
          {successMessage}
        </MuiAlert>
      )}
    </>
  );
};

export default Alert;
