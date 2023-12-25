export interface LoginType {
  email: string;
  password: string;
}

export interface RegisterType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResendVerificationType {
  email: string;
}

export interface ForgotPasswordType {
  email: string;
}

export interface ResetPasswordType {
  resetPasswordToken?: string;
  password: string;
  confirmPassword: string;
}
