import { z } from 'zod';

// Validation schema for storekeeper form
export const addStorekeeperSchema = z.object({
    email: z
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    departmentName: z.string().min(1, 'Department is required'),
});

export type AddStorekeeperFormData = z.infer<typeof addStorekeeperSchema>;
