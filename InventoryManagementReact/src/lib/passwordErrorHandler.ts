import { toast } from '@/hooks/useToast';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from './error-utils';

export interface PasswordErrorContext {
    operation: 'change' | 'reset' | 'validate';
    field?: 'oldPassword' | 'newPassword' | 'confirmPassword';
}

/**
 * Handles password-related errors with hierarchical toast notifications
 */
export class PasswordErrorHandler {
    private static errorCount = 0;
    private static readonly MAX_ERRORS = 3;
    private static readonly ERROR_TIMEOUT = 5000;

    /**
     * Shows a password error toast with proper hierarchy and timing
     */
    static showError(error: unknown, context: PasswordErrorContext): void {
        const apiError = formatApiError(error);
        const friendlyMessage = getFriendlyErrorMessage(apiError);
        const validationErrors = formatValidationErrors(
            apiError.details || null
        );

        // Increment error count for hierarchy
        this.errorCount++;
        const errorLevel = Math.min(this.errorCount, this.MAX_ERRORS);

        // Determine toast variant based on error level
        const variant = this.getToastVariant(errorLevel);
        const duration = this.getToastDuration(errorLevel);

        // Create error message based on context
        const title = this.getErrorTitle(context, errorLevel);
        const description = this.getErrorDescription(
            friendlyMessage,
            validationErrors,
            context,
            errorLevel
        );

        // Show the toast
        toast({
            title,
            description,
            variant,
            duration,
            onOpenChange: (open) => {
                if (!open) {
                    this.errorCount = Math.max(0, this.errorCount - 1);
                }
            },
        });

        // Auto-reset error count after timeout
        setTimeout(() => {
            this.errorCount = Math.max(0, this.errorCount - 1);
        }, this.ERROR_TIMEOUT);
    }

    /**
     * Shows a password success toast
     */
    static showSuccess(context: PasswordErrorContext): void {
        const title = this.getSuccessTitle(context);
        const description = this.getSuccessDescription(context);

        toast({
            title,
            description,
            variant: 'success',
            duration: 4000,
        });
    }

    /**
     * Shows a password warning toast
     */
    static showWarning(message: string, context: PasswordErrorContext): void {
        const title = this.getWarningTitle(context);
        const description = message;

        toast({
            title,
            description,
            variant: 'warning',
            duration: 4000,
        });
    }

    /**
     * Shows a password info toast
     */
    static showInfo(message: string, context: PasswordErrorContext): void {
        const title = this.getInfoTitle(context);
        const description = message;

        toast({
            title,
            description,
            variant: 'info',
            duration: 3000,
        });
    }

    /**
     * Clears all password error toasts
     */
    static clearAll(): void {
        this.errorCount = 0;
        // Note: Individual toast dismiss is handled by the toast component
        // This method can be extended if needed for bulk dismiss
    }

    private static getToastVariant(
        errorLevel: number
    ): 'default' | 'destructive' {
        return errorLevel >= 2 ? 'destructive' : 'default';
    }

    private static getToastDuration(errorLevel: number): number {
        // Higher error levels get longer display time
        return 3000 + errorLevel * 1000;
    }

    private static getErrorTitle(
        context: PasswordErrorContext,
        errorLevel: number
    ): string {
        const operationNames = {
            change: 'Change Password',
            reset: 'Reset Password',
            validate: 'Password Validation',
        };

        const baseTitle =
            operationNames[context.operation] || 'Password Operation';

        if (errorLevel === 1) {
            return `🔒 ${baseTitle} Failed`;
        } else if (errorLevel === 2) {
            return `⚠️ ${baseTitle} Failed Again`;
        } else {
            return `🚨 ${baseTitle} Still Failing`;
        }
    }

    private static getErrorDescription(
        friendlyMessage: string,
        validationErrors: string[],
        context: PasswordErrorContext,
        errorLevel: number
    ): string {
        let description = friendlyMessage;

        // Add field-specific information
        if (context.field) {
            const fieldNames = {
                oldPassword: 'Current Password',
                newPassword: 'New Password',
                confirmPassword: 'Confirm Password',
            };
            description = `${fieldNames[context.field]}: ${description}`;
        }

        // Add validation errors if present
        if (validationErrors.length > 0) {
            description += `\n\nValidation errors:\n• ${validationErrors.join('\n• ')}`;
        }

        // Add specific password error context
        if (
            friendlyMessage.includes('current password') ||
            friendlyMessage.includes('old password')
        ) {
            description +=
                '\n\nPlease verify your current password is correct.';
        } else if (
            friendlyMessage.includes('new password') ||
            friendlyMessage.includes('password requirements')
        ) {
            description +=
                '\n\nPlease ensure your new password meets all requirements.';
        } else if (
            friendlyMessage.includes('confirm') ||
            friendlyMessage.includes('match')
        ) {
            description +=
                '\n\nPlease ensure both password fields match exactly.';
        }

        // Add retry suggestion for higher error levels
        if (errorLevel >= 2) {
            description +=
                '\n\nPlease try again or contact support if the issue persists.';
        }

        return description;
    }

    private static getSuccessTitle(context: PasswordErrorContext): string {
        const operationNames = {
            change: '✅ Password Changed',
            reset: '✅ Password Reset',
            validate: '✅ Password Valid',
        };

        return operationNames[context.operation] || '✅ Success';
    }

    private static getSuccessDescription(
        context: PasswordErrorContext
    ): string {
        const descriptions = {
            change: 'Your password has been successfully changed. Please log in again with your new password.',
            reset: 'Your password has been successfully reset. You can now log in with your new password.',
            validate: 'Your password meets all security requirements.',
        };

        return (
            descriptions[context.operation] ||
            'Password operation completed successfully.'
        );
    }

    private static getWarningTitle(context: PasswordErrorContext): string {
        const operationNames = {
            change: '⚠️ Password Change Warning',
            reset: '⚠️ Password Reset Warning',
            validate: '⚠️ Password Validation Warning',
        };

        return operationNames[context.operation] || '⚠️ Password Warning';
    }

    private static getInfoTitle(context: PasswordErrorContext): string {
        const operationNames = {
            change: 'ℹ️ Password Change Info',
            reset: 'ℹ️ Password Reset Info',
            validate: 'ℹ️ Password Validation Info',
        };

        return operationNames[context.operation] || 'ℹ️ Password Info';
    }
}

/**
 * Convenience functions for common password operations
 */
export const passwordErrorHandler = {
    changePassword: (error: unknown, field?: PasswordErrorContext['field']) => {
        PasswordErrorHandler.showError(error, {
            operation: 'change',
            field,
        });
    },

    resetPassword: (error: unknown, field?: PasswordErrorContext['field']) => {
        PasswordErrorHandler.showError(error, {
            operation: 'reset',
            field,
        });
    },

    validatePassword: (
        error: unknown,
        field?: PasswordErrorContext['field']
    ) => {
        PasswordErrorHandler.showError(error, {
            operation: 'validate',
            field,
        });
    },

    success: (context: PasswordErrorContext) => {
        PasswordErrorHandler.showSuccess(context);
    },

    warning: (message: string, context: PasswordErrorContext) => {
        PasswordErrorHandler.showWarning(message, context);
    },

    info: (message: string, context: PasswordErrorContext) => {
        PasswordErrorHandler.showInfo(message, context);
    },

    clearAll: () => {
        PasswordErrorHandler.clearAll();
    },
};
