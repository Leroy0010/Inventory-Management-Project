import { toast } from '@/hooks/useToast';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from './error-utils';

export interface CartErrorContext {
    operation: 'add' | 'remove' | 'update' | 'clear' | 'submit' | 'fetch';
    itemName?: string;
    itemId?: number;
    quantity?: number;
}

/**
 * Handles cart-related errors with hierarchical toast notifications
 */
export class CartErrorHandler {
    private static errorCount = 0;
    private static readonly MAX_ERRORS = 3;
    private static readonly ERROR_TIMEOUT = 5000;

    /**
     * Shows a cart error toast with proper hierarchy and timing
     */
    static showError(error: unknown, context: CartErrorContext): void {
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
     * Shows a cart success toast
     */
    static showSuccess(context: CartErrorContext): void {
        const title = this.getSuccessTitle(context);
        const description = this.getSuccessDescription(context);

        toast({
            title,
            description,
            variant: 'default',
            duration: 3000,
        });
    }

    /**
     * Shows a cart warning toast
     */
    static showWarning(message: string, context: CartErrorContext): void {
        const title = this.getWarningTitle(context);
        const description = message;

        toast({
            title,
            description,
            variant: 'destructive',
            duration: 4000,
        });
    }

    /**
     * Clears all cart error toasts
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
        context: CartErrorContext,
        errorLevel: number
    ): string {
        const operationNames = {
            add: 'Add to Cart',
            remove: 'Remove from Cart',
            update: 'Update Cart Item',
            clear: 'Clear Cart',
            submit: 'Submit Request',
            fetch: 'Load Cart',
        };

        const baseTitle = operationNames[context.operation] || 'Cart Operation';

        if (errorLevel === 1) {
            return `❌ ${baseTitle} Failed`;
        } else if (errorLevel === 2) {
            return `⚠️ ${baseTitle} Failed Again`;
        } else {
            return `🚨 ${baseTitle} Still Failing`;
        }
    }

    private static getErrorDescription(
        friendlyMessage: string,
        validationErrors: string[],
        context: CartErrorContext,
        errorLevel: number
    ): string {
        let description = friendlyMessage;

        // Add context-specific information
        if (context.itemName) {
            description = `${context.itemName}: ${description}`;
        }

        if (context.quantity && context.operation !== 'clear') {
            description = `Quantity ${context.quantity} - ${description}`;
        }

        // Add validation errors if present
        if (validationErrors.length > 0) {
            description += `\n\nValidation errors:\n• ${validationErrors.join('\n• ')}`;
        }

        // Add retry suggestion for higher error levels
        if (errorLevel >= 2) {
            description +=
                '\n\nPlease try refreshing the page or contact support if the issue persists.';
        }

        return description;
    }

    private static getSuccessTitle(context: CartErrorContext): string {
        const operationNames = {
            add: '✅ Added to Cart',
            remove: '✅ Removed from Cart',
            update: '✅ Cart Updated',
            clear: '✅ Cart Cleared',
            submit: '✅ Request Submitted',
            fetch: '✅ Cart Loaded',
        };

        return operationNames[context.operation] || '✅ Success';
    }

    private static getSuccessDescription(context: CartErrorContext): string {
        if (context.itemName) {
            return `${context.itemName} has been ${this.getSuccessAction(context.operation)}.`;
        }

        const actions = {
            add: 'added to your cart',
            remove: 'removed from your cart',
            update: 'updated in your cart',
            clear: 'cleared from your cart',
            submit: 'submitted successfully',
            fetch: 'loaded successfully',
        };

        return `Item has been ${actions[context.operation] || 'processed'}.`;
    }

    private static getSuccessAction(
        operation: CartErrorContext['operation']
    ): string {
        const actions = {
            add: 'added to your cart',
            remove: 'removed from your cart',
            update: 'updated in your cart',
            clear: 'cleared from your cart',
            submit: 'submitted successfully',
            fetch: 'loaded successfully',
        };

        return actions[operation] || 'processed';
    }

    private static getWarningTitle(context: CartErrorContext): string {
        const operationNames = {
            add: '⚠️ Add to Cart Warning',
            remove: '⚠️ Remove from Cart Warning',
            update: '⚠️ Update Cart Warning',
            clear: '⚠️ Clear Cart Warning',
            submit: '⚠️ Submit Request Warning',
            fetch: '⚠️ Load Cart Warning',
        };

        return operationNames[context.operation] || '⚠️ Cart Warning';
    }
}

/**
 * Convenience functions for common cart operations
 */
export const cartErrorHandler = {
    addItem: (error: unknown, itemName: string, quantity: number) => {
        CartErrorHandler.showError(error, {
            operation: 'add',
            itemName,
            quantity,
        });
    },

    removeItem: (error: unknown, itemName: string, quantity: number) => {
        CartErrorHandler.showError(error, {
            operation: 'remove',
            itemName,
            quantity,
        });
    },

    updateItem: (error: unknown, itemName: string, quantity: number) => {
        CartErrorHandler.showError(error, {
            operation: 'update',
            itemName,
            quantity,
        });
    },

    clearCart: (error: unknown) => {
        CartErrorHandler.showError(error, {
            operation: 'clear',
        });
    },

    submitRequest: (error: unknown) => {
        CartErrorHandler.showError(error, {
            operation: 'submit',
        });
    },

    fetchCart: (error: unknown) => {
        CartErrorHandler.showError(error, {
            operation: 'fetch',
        });
    },

    success: (context: CartErrorContext) => {
        CartErrorHandler.showSuccess(context);
    },

    warning: (message: string, context: CartErrorContext) => {
        CartErrorHandler.showWarning(message, context);
    },

    clearAll: () => {
        CartErrorHandler.clearAll();
    },
};
