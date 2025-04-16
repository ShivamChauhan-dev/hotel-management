const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { bookingSchema, bookingIdSchema, updateMultipleBookingSchema } = require('../utils/zodSchemas');
const { generateBookingId } = require('../utils/utils');
const { sendBookingConfirmationEmail } = require('../utils/email');

class BookingService {
  async createBooking(bookingData, user) {
    const { error } = bookingSchema.validate(bookingData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { roomId, startDate, endDate } = bookingData;

    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    const existingBookings = await Booking.find({
      room: roomId,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      ],
    });

    if (existingBookings.length > 0) {
      throw new Error('Room is not available for the selected dates');
    }
    const bookingId = generateBookingId();

    const newBooking = new Booking({
      room: roomId,
      startDate,
      endDate,
      user: user._id,
      bookingId,
      status: 'pending',
    });

    await newBooking.save();

    await sendBookingConfirmationEmail(user.email, bookingId);

    return newBooking;
  }

  async getAllBookings(filters) {
    const {
      roomId, userId, startDate, endDate, status, limit = 10, skip = 0,
    } = filters;

    const query = {};
    if (roomId) query.room = roomId;
    if (userId) query.user = userId;
    if (startDate && endDate) {
      query.startDate = { $gte: startDate };
      query.endDate = { $lte: endDate };
    } else if (startDate) {
      query.startDate = { $gte: startDate };
    } else if (endDate) {
      query.endDate = { $lte: endDate };
    }
    if (status) query.status = status;

    return Booking.find(query).limit(limit).skip(skip);
  }

  async cancelBooking(id) {
    const { error } = bookingIdSchema.validate({ id });
    if (error) {
      throw new Error(error.details[0].message);
    }
    const booking = await Booking.findByIdAndUpdate(id, { status: 'canceled' }, { new: true });
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  async changeBookingStatus(id, newStatus) {
    const { error } = bookingIdSchema.validate({ id });
    if (error) {
      throw new Error(error.details[0].message);
    }
    const booking = await Booking.findByIdAndUpdate(id, { status: newStatus }, { new: true });
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  async changeMultipleBookingStatus(bookings, newStatus) {
    const { error } = updateMultipleBookingSchema.validate({ bookings });
    if (error) {
      throw new Error(error.details[0].message);
    }
    const operations = bookings.map((id) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { status: newStatus } },
      },
    }));

    const result = await Booking.bulkWrite(operations);
    return result;
  }
}

module.exports = new BookingService();