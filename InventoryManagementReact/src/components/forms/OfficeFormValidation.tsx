import { z } from 'zod';

// Validation schema for office form
export const addOfficeSchema = z.object({
    name: z.string().min(1, 'Office name is required'),
    location: z.string().optional(),
    description: z.string().optional(),
});

export type AddOfficeFormData = z.infer<typeof addOfficeSchema>;
