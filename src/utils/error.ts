import { ErrorType } from '../types';

export const getErrorMessage = (error: ErrorType) => {
  return error?.errorMessage || 'Something went wrong';
};
