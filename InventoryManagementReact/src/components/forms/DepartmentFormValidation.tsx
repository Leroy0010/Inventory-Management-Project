import { z } from 'zod';

// Enhanced validation schema for department form
export const addDepartmentSchema = z.object({
    name: z
        .string()
        .min(1, 'Department name is required')
        .min(3, 'Department name must be at least 2 characters')
        .max(100, 'Department name must be less than 50 characters')
        .regex(
            /^[a-zA-Z0-9\s\-&]+$/,
            'Department name can only contain letters, numbers, spaces, hyphens, and ampersands'
        ),
    description: z
        .string()
        .max(500, 'Description must be less than 500 characters')
        .optional()
        .or(z.literal('')),
});

export type AddDepartmentFormData = z.infer<typeof addDepartmentSchema>;
