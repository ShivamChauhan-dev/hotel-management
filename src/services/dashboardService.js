const Room = require('../models/Room');
const Booking = require('../models/Booking');
const { startOfDay, endOfDay, subDays } = require('date-fns');

class DashboardService {
  async getTotalRooms() {
    return await Room.countDocuments();
  }

  async getTotalBookings() {
    return await Booking.countDocuments();
  }

  async getTotalRevenue() {
    const result = await Booking.aggregate([
      {
        $match: { status: 'Confirmed' },
      },
      {
        $lookup: {
          from: 'rooms',
          localField: 'room',
          foreignField: '_id',
          as: 'roomDetails',
        },
      },
      {
        $unwind: '$roomDetails',
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$roomDetails.price' },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalRevenue : 0;
  }

  async getTopRooms() {
    const result = await Booking.aggregate([
      {
        $match: { status: 'Confirmed' },
      },
      {
        $group: {
          _id: '$room',
          bookingCount: { $sum: 1 },
        },
      },
      {
        $sort: { bookingCount: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'rooms',
          localField: '_id',
          foreignField: '_id',
          as: 'roomDetails',
        },
      },
      {
        $unwind: '$roomDetails',
      },
      {
        $project: {
          _id: 0,
          roomName: '$roomDetails.name',
          bookingCount: 1,
        },
      },
    ]);
    return result;
  }

  async getRevenueChartData() {
    const dailyRevenue = await Booking.aggregate([
      {
        $match: { status: 'Confirmed' },
      },
      {
        $lookup: {
          from: 'rooms',
          localField: 'room',
          foreignField: '_id',
          as: 'roomDetails',
        },
      },
      {
        $unwind: '$roomDetails',
      },
      {
        $addFields: {
          bookingDate: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
        },
      },
      {
        $group: {
          _id: '$bookingDate',
          totalRevenue: { $sum: '$roomDetails.price' },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalRevenue: 1,
        },
      },
    ]);
    return dailyRevenue;
  }

  async getBookingHeatmap() {
    const result = await Booking.aggregate([
      {
        $match: { status: 'Confirmed' },
      },
      {
        $addFields: {
          dayOfWeek: { $dayOfWeek: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$dayOfWeek',
          bookingCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          dayOfWeek: '$_id',
          bookingCount: 1,
        },
      },
    ]);
    return result;
  }
}

module.exports = new DashboardService();