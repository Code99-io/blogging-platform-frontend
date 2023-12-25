export interface MyAccountType {
  email: string;
  name: string;
}

export interface ChangePasswordType {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
