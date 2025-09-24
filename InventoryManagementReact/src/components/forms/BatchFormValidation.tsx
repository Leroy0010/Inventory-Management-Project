import { z } from 'zod';

// Enhanced validation schema for batch form
export const addBatchSchema = z.object({
    itemName: z
        .string()
        .min(1, 'Please select an item')
        .max(100, 'Item name must be less than 100 characters'),
    quantity: z
        .number()
        .min(1, 'Quantity must be at least 1')
        .max(10000, 'Quantity cannot exceed 10,000')
        .int('Quantity must be a whole number'),
    totalPrice: z
        .number()
        .min(0.01, 'Total price must be greater than 0')
        .max(999999.99, 'Total price cannot exceed 999,999.99')
        .refine(
            (value) => {
                // Check if the number is finite (not Infinity or NaN)
                if (!Number.isFinite(value)) {
                    return false;
                }

                // Convert the number to a string and check the decimal places
                const parts = value.toString().split('.');
                if (parts.length === 1) {
                    return true; // No decimal part, considered valid
                }
                // Check if the decimal part has 2 or fewer digits
                return parts[1].length <= 2;
            },
            {
                message: 'Total price must have at most 2 decimal places',
            }
        ),
    supplierName: z
        .string()
        .max(100, 'Supplier name must be less than 100 characters')
        .optional()
        .or(z.literal('')),
    invoiceId: z
        .string()
        .max(20, 'Invoice ID cannot be more than 20 characters')
        .optional()
        .or(z.literal('')),
});

export type AddBatchFormData = z.infer<typeof addBatchSchema>;
