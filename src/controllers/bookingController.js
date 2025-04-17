import * as bookingService from '../services/bookingService.js';
import * as userService from '../services/userService.js';
import { sendEmail } from '../utils/email.js';
import { z } from 'zod';
import { generateBookingId } from '../utils/utils.js';
import config from '../config/config.js';

// Schema for creating a booking
const createBookingSchema = z.object({
  roomId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  userId: z.string(),
});

// Schema for getting bookings with filters
const getBookingsSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    roomId: z.string().optional(),
    userId: z.string().optional(),
    status: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
});

// Schema for changing booking status
const changeBookingStatusSchema = z.object({
    bookingId: z.string(),
    status: z.enum(['Pending', 'Confirmed', 'Cancelled']),
});

//Schema for changing multiple booking status
const changeMultipleBookingStatusSchema = z.object({
    bookingIds: z.array(z.string()),
    status: z.enum(['Pending', 'Confirmed', 'Cancelled']),
});

export const createBooking = async (req, res, next) => {
    try {
        const { roomId, startDate, endDate, userId } = createBookingSchema.parse(req.body);

        const bookingId = generateBookingId();
        const booking = await bookingService.createBooking({ roomId, startDate, endDate, userId, bookingId });
        
        if(booking){
            const user = await userService.getUserById(userId);
            const emailBody = `
            <p>Dear ${user.name},</p>
            <p>Your booking with ID <strong>${bookingId}</strong> for the room <strong>${booking.room.name}</strong> has been successfully created.</p>
            <p>Booking Details:</p>
            <ul><li>Start Date: ${startDate.toDateString()}</li><li>End Date: ${endDate.toDateString()}</li></ul>`;

            await sendEmail(user.email, 'Booking Confirmation', emailBody);
        }

        res.status(201).json(booking);
    } catch (error) {
        next(error);
    }
};
export const getAllBookings = async (req, res, next) => {
    try {
        const { page, limit, roomId, userId, status, startDate, endDate } = getBookingsSchema.parse(req.query);
        const bookings = await bookingService.getAllBookings({ page, limit, roomId, userId, status, startDate, endDate });
        res.json(bookings);
    } catch (error) {
        next(error);
    }
};

export const cancelBooking = async (req, res, next) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await bookingService.cancelBooking(bookingId);
        res.json(booking);
    } catch (error) {
        next(error);
    }
};

export const changeBookingStatus = async (req, res, next) => {
    try {
      const { bookingId, status } = changeBookingStatusSchema.parse(req.body);
      const booking = await bookingService.changeBookingStatus(bookingId, status);
      res.json(booking);
    } catch (error) {
      next(error);
    }
  };

  export const changeMultipleBookingStatus = async (req, res, next) => {
    try {
      const { bookingIds, status } = changeMultipleBookingStatusSchema.parse(req.body);
      const result = await bookingService.changeMultipleBookingStatus(bookingIds, status);
      res.json({ message: `${result.modifiedCount} bookings updated successfully` });
    } catch (error) {
      next(error);
    }
  };