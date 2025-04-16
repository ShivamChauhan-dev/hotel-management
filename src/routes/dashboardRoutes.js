const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const adminAuth = [authMiddleware, roleMiddleware(['admin'])];

router.get('/total-rooms', adminAuth, dashboardController.getTotalRooms);
router.get('/total-bookings', adminAuth, dashboardController.getTotalBookings);
router.get('/total-revenue', adminAuth, dashboardController.getTotalRevenue);
router.get('/top-rooms', adminAuth, dashboardController.getTopRooms);
router.get('/revenue-chart', adminAuth, dashboardController.getRevenueChartData);
router.get('/booking-heatmap', adminAuth, dashboardController.getBookingHeatmap);


module.exports = router;