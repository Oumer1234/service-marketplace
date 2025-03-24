import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
}).refine(data => {
  // If any password field is filled, they all must be filled
  const hasCurrentPassword = !!data.currentPassword;
  const hasNewPassword = !!data.newPassword;
  const hasConfirmNewPassword = !!data.confirmNewPassword;

  if (hasCurrentPassword || hasNewPassword || hasConfirmNewPassword) {
    return hasCurrentPassword && hasNewPassword && hasConfirmNewPassword;
  }

  return true;
}, {
  message: 'All password fields must be filled to change password',
  path: ['newPassword'],
}).refine(data => {
  // If passwords are provided, they must match
  if (data.newPassword && data.confirmNewPassword) {
    return data.newPassword === data.confirmNewPassword;
  }
  return true;
}, {
  message: 'New passwords do not match',
  path: ['confirmNewPassword'],
}).refine(data => {
  // If new password is provided, it must meet requirements
  if (data.newPassword) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(data.newPassword);
  }
  return true;
}, {
  message: 'New password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number',
  path: ['newPassword'],
});

export const serviceProviderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  serviceType: z.string().min(2, 'Service type is required'),
  hourlyRate: z.number().min(1, 'Hourly rate must be at least 1'),
  about: z.string().min(20, 'About must be at least 20 characters'),
});
