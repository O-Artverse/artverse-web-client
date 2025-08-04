import { z } from "zod";

export const signUpSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }).min(1, { message: 'Email is required' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).min(1, { message: 'Password is required' }),
    birthdate: z.date().min(new Date(new Date().setFullYear(new Date().getFullYear() - 100)), { message: 'You must be at least 100 years old' }).min(1, { message: 'Birthdate is required' }),
});

export type SignUpPostDto = z.infer<typeof signUpSchema>;