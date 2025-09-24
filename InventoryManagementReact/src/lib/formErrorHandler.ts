import { toast } from '@/hooks/useToast';
import {
    formatApiError,
    getFriendlyErrorMessage,
    formatValidationErrors,
} from './error-utils';

export interface FormErrorContext {
    operation: 'create' | 'update' | 'delete' | 'fetch';
    entity:
        | 'inventory'
        | 'staff'
        | 'storekeeper'
        | 'office'
        | 'department'
        | 'batch'
        | 'request'
        | 'notification'
        | 'profile'
        | 'report';
    entityName?: string;
    entityId?: number | string;
}

/**
 * Handles form-related errors with hierarchical toast notifications
 */
export class FormErrorHandler {
    private static errorCount = 0;
    private static readonly MAX_ERRORS = 3;
    private static readonly ERROR_TIMEOUT = 5000;

    /**
     * Shows a form error toast with proper hierarchy and timing
     */
    static showError(error: unknown, context: FormErrorContext): void {
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
     * Shows a form success toast
     */
    static showSuccess(context: FormErrorContext): void {
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
     * Shows a form warning toast
     */
    static showWarning(message: string, context: FormErrorContext): void {
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
     * Shows a form info toast
     */
    static showInfo(message: string, context: FormErrorContext): void {
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
     * Clears all form error toasts
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
        context: FormErrorContext,
        errorLevel: number
    ): string {
        const operationNames = {
            create: 'Create',
            update: 'Update',
            delete: 'Delete',
            fetch: 'Load',
        };

        const entityNames = {
            inventory: 'Inventory Item',
            staff: 'Staff Member',
            storekeeper: 'Storekeeper',
            office: 'Office',
            department: 'Department',
            batch: 'Batch',
            request: 'Request',
            notification: 'Notification',
            profile: 'Profile',
            report: 'Report',
        };

        const baseTitle = `${operationNames[context.operation]} ${entityNames[context.entity]}`;

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
        context: FormErrorContext,
        errorLevel: number
    ): string {
        let description = friendlyMessage;

        // Add entity-specific information
        if (context.entityName) {
            description = `${context.entityName}: ${description}`;
        }

        // Add validation errors if present
        if (validationErrors.length > 0) {
            description += `\n\nValidation errors:\n• ${validationErrors.join('\n• ')}`;
        }

        // Add specific form error context
        if (
            friendlyMessage.includes('duplicate') ||
            friendlyMessage.includes('already exists')
        ) {
            description +=
                '\n\nPlease check if this item already exists or try a different name.';
        } else if (
            friendlyMessage.includes('permission') ||
            friendlyMessage.includes('unauthorized')
        ) {
            description +=
                '\n\nYou do not have permission to perform this action.';
        } else if (
            friendlyMessage.includes('network') ||
            friendlyMessage.includes('timeout')
        ) {
            description +=
                '\n\nPlease check your internet connection and try again.';
        }

        // Add retry suggestion for higher error levels
        if (errorLevel >= 2) {
            description +=
                '\n\nPlease try again or contact support if the issue persists.';
        }

        return description;
    }

    private static getSuccessTitle(context: FormErrorContext): string {
        const operationNames = {
            create: '✅ Created',
            update: '✅ Updated',
            delete: '✅ Deleted',
            fetch: '✅ Loaded',
        };

        const entityNames = {
            inventory: 'Inventory Item',
            staff: 'Staff Member',
            storekeeper: 'Storekeeper',
            office: 'Office',
            department: 'Department',
            batch: 'Batch',
            request: 'Request',
            notification: 'Notification',
            profile: 'Profile',
            report: 'Report',
        };

        return `${operationNames[context.operation]} ${entityNames[context.entity]}`;
    }

    private static getSuccessDescription(context: FormErrorContext): string {
        const descriptions = {
            create: `The ${context.entity} has been successfully created.`,
            update: `The ${context.entity} has been successfully updated.`,
            delete: `The ${context.entity} has been successfully deleted.`,
            fetch: `The ${context.entity} has been successfully loaded.`,
        };

        let description =
            descriptions[context.operation] ||
            'Operation completed successfully.';

        if (context.entityName) {
            description = description.replace(
                'The',
                `${context.entityName} has been`
            );
        }

        return description;
    }

    private static getWarningTitle(context: FormErrorContext): string {
        const operationNames = {
            create: '⚠️ Create Warning',
            update: '⚠️ Update Warning',
            delete: '⚠️ Delete Warning',
            fetch: '⚠️ Load Warning',
        };

        const entityNames = {
            inventory: 'Inventory Item',
            staff: 'Staff Member',
            storekeeper: 'Storekeeper',
            office: 'Office',
            department: 'Department',
            batch: 'Batch',
            request: 'Request',
            notification: 'Notification',
            profile: 'Profile',
            report: 'Report',
        };

        return `${operationNames[context.operation]} ${entityNames[context.entity]}`;
    }

    private static getInfoTitle(context: FormErrorContext): string {
        const operationNames = {
            create: 'ℹ️ Create Info',
            update: 'ℹ️ Update Info',
            delete: 'ℹ️ Delete Info',
            fetch: 'ℹ️ Load Info',
        };

        const entityNames = {
            inventory: 'Inventory Item',
            staff: 'Staff Member',
            storekeeper: 'Storekeeper',
            office: 'Office',
            department: 'Department',
            batch: 'Batch',
            request: 'Request',
            notification: 'Notification',
            profile: 'Profile',
            report: 'Report',
        };

        return `${operationNames[context.operation]} ${entityNames[context.entity]}`;
    }
}

/**
 * Convenience functions for common form operations
 */
export const formErrorHandler = {
    createInventory: (error: unknown, itemName?: string) => {
        FormErrorHandler.showError(error, {
            operation: 'create',
            entity: 'inventory',
            entityName: itemName,
        });
    },

    updateInventory: (error: unknown, itemName?: string, itemId?: number) => {
        FormErrorHandler.showError(error, {
            operation: 'update',
            entity: 'inventory',
            entityName: itemName,
            entityId: itemId,
        });
    },

    deleteInventory: (error: unknown, itemName?: string, itemId?: number) => {
        FormErrorHandler.showError(error, {
            operation: 'delete',
            entity: 'inventory',
            entityName: itemName,
            entityId: itemId,
        });
    },

    createStaff: (error: unknown, staffName?: string) => {
        FormErrorHandler.showError(error, {
            operation: 'create',
            entity: 'staff',
            entityName: staffName,
        });
    },

    createStorekeeper: (error: unknown, storekeeperName?: string) => {
        FormErrorHandler.showError(error, {
            operation: 'create',
            entity: 'storekeeper',
            entityName: storekeeperName,
        });
    },

    createOffice: (error: unknown, officeName?: string) => {
        FormErrorHandler.showError(error, {
            operation: 'create',
            entity: 'office',
            entityName: officeName,
        });
    },

    createDepartment: (error: unknown, departmentName?: string) => {
        FormErrorHandler.showError(error, {
            operation: 'create',
            entity: 'department',
            entityName: departmentName,
        });
    },

    createReport: (error: unknown, reportName?: string) => {
        FormErrorHandler.showError(error, {
            operation: 'create',
            entity: 'report',
            entityName: reportName,
        });
    },

    success: (context: FormErrorContext) => {
        FormErrorHandler.showSuccess(context);
    },

    warning: (message: string, context: FormErrorContext) => {
        FormErrorHandler.showWarning(message, context);
    },

    info: (message: string, context: FormErrorContext) => {
        FormErrorHandler.showInfo(message, context);
    },

    clearAll: () => {
        FormErrorHandler.clearAll();
    },
};
