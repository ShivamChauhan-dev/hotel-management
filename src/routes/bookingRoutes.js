import express from 'express';
import { createBooking, getAllBookings, changeBookingStatus, changeMultipleBookingStatus } from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const bookingRouter = express.Router();

bookingRouter.post('/', authMiddleware, createBooking);
bookingRouter.get('/', authMiddleware, roleMiddleware(['admin']), getAllBookings);
bookingRouter.put('/:id', authMiddleware, roleMiddleware(['admin']), changeBookingStatus);
bookingRouter.put('/', authMiddleware, roleMiddleware(['admin']), changeMultipleBookingStatus)

export default bookingRouter;