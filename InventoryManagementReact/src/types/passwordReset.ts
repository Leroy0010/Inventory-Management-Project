// Password Reset Types
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
}

export interface PasswordChangeRequest {
  token: string;
  newPassword: string;
}

export interface PasswordChangeResponse {
  message: string;
}

export interface PasswordResetError {
  error: string;
  message: string;
}

// Form validation schemas
export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

// Password strength validation
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
}

// Password reset flow states
export type PasswordResetStep = 'forgot-password' | 'reset-password' | 'success';

export interface PasswordResetState {
  step: PasswordResetStep;
  email?: string;
  token?: string;
  isLoading: boolean;
  error: string | null;
}
