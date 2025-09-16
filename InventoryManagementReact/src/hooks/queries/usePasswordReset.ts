import { useMutation } from '@tanstack/react-query';
import { passwordResetApi } from '@/api/passwordReset';
import type { 
  PasswordResetRequest, 
  PasswordChangeRequest,
  PasswordResetResponse,
  PasswordChangeResponse 
} from '@/types/passwordReset';

// Hook for requesting password reset
export function useRequestPasswordReset() {
  return useMutation<PasswordResetResponse, Error, PasswordResetRequest>({
    mutationFn: passwordResetApi.requestPasswordReset,
    onError: (error: any) => {
      // Password reset request failed
    },
  });
}

// Hook for resetting password with token
export function useResetPassword() {
  return useMutation<PasswordChangeResponse, Error, PasswordChangeRequest>({
    mutationFn: passwordResetApi.resetPassword,
    onError: (error: any) => {
      // Password reset failed
    },
  });
}

// Combined hook for password reset operations
export function usePasswordResetQueries() {
  const requestPasswordReset = useRequestPasswordReset();
  const resetPassword = useResetPassword();

  return {
    requestPasswordReset,
    resetPassword,
  };
}
