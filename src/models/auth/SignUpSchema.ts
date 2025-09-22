import { z } from "zod";

export const signUpSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }).min(1, { message: 'Email is required' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }).min(1, { message: 'Password is required' }),
    birthdate: z.date({
        message: 'Birthdate is required'
    }).refine((date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
            return age - 1 >= 13;
        }
        return age >= 13;
    }, {
        message: 'You must be at least 13 years old'
    }).refine((date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return age <= 100;
    }, {
        message: 'You must be less than 100 years old'
    }),
});

export type SignUpPostDto = z.infer<typeof signUpSchema>;