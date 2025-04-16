import express from 'express';
const router = express.Router();
import * as dashboardController from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const adminAuth = [authMiddleware, roleMiddleware(['admin'])]; 

router.get('/total-rooms', adminAuth, dashboardController.getTotalRooms); 
router.get('/total-bookings', adminAuth, dashboardController.getTotalBookings); 
router.get('/total-revenue', adminAuth, dashboardController.getTotalRevenue); 
router.get('/top-rooms', adminAuth, dashboardController.getTopRooms); 
router.get('/revenue-chart', adminAuth, dashboardController.getRevenueChartData); 
router.get('/booking-heatmap', adminAuth, dashboardController.getBookingHeatmap); 

export default router;


module.exports = router;