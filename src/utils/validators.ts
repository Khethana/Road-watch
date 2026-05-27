import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  ward: z.string().min(1, 'Please select your ward'),
});

export const reportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description cannot exceed 1000 characters'),
  severity: z.enum(['critical', 'moderate', 'low'], { required_error: 'Please select a severity level' }),
  state: z.string().min(1, 'Please select a state'),
  city: z.string().min(1, 'Please select a city'),
  area: z.string().optional(),
  lat: z.number({ invalid_type_error: 'Please set a location on the map' }),
  lng: z.number({ invalid_type_error: 'Please set a location on the map' }),
  image: z.instanceof(File).optional(),
});
