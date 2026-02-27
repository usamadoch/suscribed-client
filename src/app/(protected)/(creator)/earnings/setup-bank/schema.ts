import * as z from 'zod';

export const payoutSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    address1: z.string().min(1, "Address line 1 is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    termsAgreed: z.boolean().refine(val => val === true, {
        message: "You must agree to the terms and conditions",
    }),
    bankName: z.string().min(1, "Bank name is required"),
    accountHolderName: z.string().min(1, "Account holder name is required"),
    iban: z.string().min(1, "IBAN is required"),
    idType: z.enum(['id_card', 'driving_license', 'passport']),
    idNumber: z.string().min(1, "ID number is required"),
});

export type PayoutFormData = z.infer<typeof payoutSchema>;
