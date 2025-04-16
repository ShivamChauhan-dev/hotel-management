import Razorpay from 'razorpay';
import config from '../config/config.js';
import Booking from '../models/Booking.js';
import { sendEmail } from '../utils/email.js';
import logger from '../config/logger.js';
import crypto from 'crypto';
  
const razorpayInstance = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

const createOrder = async (amount, currency, receipt, notes) => {
  try {
    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency,
      receipt,
      notes,
    });
    return order;
  } catch (error) {
    logger.error('Error creating order:', error);
    throw new Error('Error creating order');
  }
};

const verifyPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId, userEmail) => {
  try {
    const generatedSignature = crypto.createHmac('sha256', config.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature === razorpaySignature) {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { paymentStatus: 'paid' },
        { new: true }
      );

      if (!booking) {
        throw new Error('Booking not found');
      }

      await sendEmail(
        userEmail,
        'Payment Confirmation',
        `Your payment for booking ${bookingId} has been confirmed.`
      );

      return { message: 'Payment successful' };
    } else {
      await Booking.findByIdAndUpdate(
        bookingId,
        { paymentStatus: 'failed' },
      );
      throw new Error('Payment verification failed');
    }
  } catch (error) {
    logger.error('Error verifying payment:', error);
    throw new Error('Error verifying payment');
  }
};

export const paymentService = {
    createOrder,
    verifyPayment,
  };