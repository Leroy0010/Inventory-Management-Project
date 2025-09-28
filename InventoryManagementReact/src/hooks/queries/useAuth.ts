// Barrel exports for all auth-related hooks
export { useProfile } from './useProfile';
export { useLogin } from './useLogin';
export { useRefreshToken } from './useRefreshToken';
export { useLogout } from './useLogout';
export { useUpdateProfile } from './useUpdateProfile';
export { useChangePassword } from './useChangePassword';
export { useRequestPasswordReset } from './useRequestPasswordReset';
export { useResetPassword } from './useResetPassword';
export { useVerify2FA } from './useVerify2FA';
export { useResendOtp } from './useResendOtp';
export { authKeys } from './authKeys';

// Import individual hooks for legacy export
import { useProfile } from './useProfile';
import { useLogin } from './useLogin';
import { useRefreshToken } from './useRefreshToken';
import { useLogout } from './useLogout';
import { useUpdateProfile } from './useUpdateProfile';
import { useChangePassword } from './useChangePassword';
import { useRequestPasswordReset } from './useRequestPasswordReset';
import { useResetPassword } from './useResetPassword';
import { useVerify2FA } from './useVerify2FA';
import { useResendOtp } from './useResendOtp';

// Legacy export for backward compatibility
export function useAuthQueries() {
    // This is now deprecated - components should use individual hooks
    console.warn(
        'useAuthQueries is deprecated. Use individual hooks like useLogin, useProfile, etc.'
    );

    return {
        profileQuery: useProfile(),
        loginMutation: useLogin(),
        refreshMutation: useRefreshToken(),
        logoutMutation: useLogout(),
        updateProfileMutation: useUpdateProfile(),
        changePasswordMutation: useChangePassword(),
        requestPasswordResetMutation: useRequestPasswordReset(),
        resetPasswordMutation: useResetPassword(),
        verify2FAMutation: useVerify2FA(),
        resendOtpMutation: useResendOtp(),
    };
}
