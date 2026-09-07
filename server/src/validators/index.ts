import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const DonationCreateSchema = z
  .object({
    donorName: z.string().min(1, 'Donor Name is required'),
    mobileNumber: z
      .string()
      .optional()
      .refine((val) => !val || /^[0-9+\-\s]{10,15}$/.test(val), {
        message: 'Invalid mobile number format',
      }),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    address: z.string().optional(),
    donationTypeId: z.string().min(1, 'Donation Type is required'),
    amount: z.number().positive('Amount must be greater than zero'),
    paymentMode: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'CARD', 'OTHER']),
    transactionRef: z.string().optional(),
    donationDate: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const digitalModes = ['UPI', 'BANK_TRANSFER', 'CHEQUE', 'CARD'];
      if (digitalModes.includes(data.paymentMode)) {
        return !!data.transactionRef && data.transactionRef.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Transaction reference is required for digital payment modes',
      path: ['transactionRef'],
    }
  );

export const DonationTypeCreateSchema = z.object({
  name: z.string().min(1, 'Donation type name is required').toUpperCase(),
  description: z.string().optional(),
});

export const ExpenseCreateSchema = z.object({
  date: z.string().optional(),
  category: z.enum([
    'FOOD',
    'TRANSPORT',
    'DECORATION',
    'ELECTRICITY',
    'MAINTENANCE',
    'SALARY',
    'OFFICE',
    'EVENT',
    'OTHER',
  ]),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be greater than zero'),
  paymentMode: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'CARD', 'OTHER']),
  reference: z.string().optional(),
  attachment: z.string().optional(),
  notes: z.string().optional(),
});

export const RejectionReasonSchema = z.object({
  rejectionReason: z.string().min(1, 'Rejection reason is required'),
});

export const UserCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'COLLECTOR', 'VIEWER']),
  mobile: z.string().optional(),
});
