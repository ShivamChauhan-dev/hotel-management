import { z } from 'zod';
import { config } from '../config/config.js'; 
import { bookingService } from '../services/bookingService.js';
import { logger } from '../config/logger.js';
import { paymentService } from '../services/paymentService.js';

const createPaymentOrderSchema = z.object({
  amount: z.number().positive(),
  currency: z.string(),
  bookingId: z.string(),
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  bookingId: z.string(),
});

export const createPaymentOrder = async (req, res, next) => {
  try {
    const { amount, currency, bookingId } = createPaymentOrderSchema.parse(req.body);

    const order = await paymentService.createOrder(amount, currency);
    const booking = await bookingService.getBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    await bookingService.updateBooking(bookingId, {paymentStatus: 'pending'})

    res.status(201).json({ order, bookingId });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } =
      verifyPaymentSchema.parse(req.body);

    const isValid = paymentService.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpay_order_id
    );
    if (!isValid) {
      await bookingService.updateBooking(bookingId, {paymentStatus: 'failed'});
      return res.status(400).json({ message: 'Payment verification failed' });
    }
    await bookingService.updateBooking(bookingId, { paymentStatus: 'paid', status: "Confirmed" });
    res.status(200).json({ message: 'Payment successful' });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};