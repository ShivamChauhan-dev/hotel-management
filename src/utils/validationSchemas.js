import { z } from 'zod';

export const bookingSchema = z.object({
  roomId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

export const bookingIdSchema = z.object({
  id: z.string(),
});

export const updateMultipleBookingSchema = z.object({
  bookings: z.array(z.string()),
});

export const roomSchema = z.object({
  features: z.array(z.string()),
  price: z.number(),
  capacity: z.number(),
  availability: z.boolean(),
  name: z.string().optional(),
  description: z.string().optional(),
});

export const getRoomsSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
  price: z.string().optional(),
  capacity: z.coerce.number().optional(),
  features: z.string().optional(),
});

export const idSchema = z.object({
  id: z.string(),
});

export const bulkCreateSchema = z.object({
  rooms: z.array(
    z.object({
      name: z.string(),
      features: z.array(z.string()),
      price: z.number(),
      capacity: z.number(),
      availability: z.boolean(),
    })
  ),
});

export const updateRoomSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    features: z.array(z.string()).optional(),
    price: z.number().optional(),
    capacity: z.number().optional(),
    availability: z.boolean().optional(),
});

export const roomAvailabilitySchema = z.object({
  available: z.boolean(),
});