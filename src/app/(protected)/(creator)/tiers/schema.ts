import * as z from 'zod';

export const tierSchema = z.object({
    name: z.string().min(1, "Tier name is required"),
    price: z.number().min(1, "Price must be at least $1"),
    description: z.string().optional(),
    benefits: z.array(z.object({
        value: z.string()
    })).optional(),
});

export type TierFormData = z.infer<typeof tierSchema>;
