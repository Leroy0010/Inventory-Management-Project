import { z } from 'zod';

export const addStaffSchema = z.object({
  email: z.email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  office: z.string().min(1, 'Office is required'),
});

export type AddStaffFormData = z.infer<typeof addStaffSchema>;
