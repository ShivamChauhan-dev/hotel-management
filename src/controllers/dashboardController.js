import dashboardService from '../services/dashboardService.js';
import { z } from 'zod';
import config from '../config/config.js'
  
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format. Expected YYYY-MM-DD" });

const getDashboardSchema = z.object({
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    period: z.enum(['daily', 'weekly', 'monthly']).optional(),
});

const dashboardController =  {
    getTotalRooms: async (req, res, next) => {
        try {
            const totalRooms = await dashboardService.getTotalRooms();
            res.json(totalRooms);
        } catch (error) {
            next(error);
        }
    },

    getTotalBookings: async (req, res, next) => {
        try {
            const totalBookings = await dashboardService.getTotalBookings();
            res.json(totalBookings);
        } catch (error) {
            next(error);
        }
    },

    getTotalRevenue: async (req, res, next) => {
        try {
            const { startDate, endDate } = req.query
            const { startDate: validatedStartDate, endDate: validatedEndDate} = getDashboardSchema.parse({ startDate, endDate })
            const totalRevenue = await dashboardService.getTotalRevenue(validatedStartDate, validatedEndDate);
            res.json(totalRevenue);
        } catch (error) {
            next(error);
        }
    },

    getTopRooms: async (req, res, next) => {
        try {
            const topRooms = await dashboardService.getTopRooms(config.TOP_ROOMS_NUMBER);
            res.json(topRooms);
        } catch (error) {
            next(error);
        }
    },

    getRevenueChartData: async (req, res, next) => {
        try {
            const { period, startDate, endDate } = req.query;
            const { period: validatedPeriod, startDate: validatedStartDate, endDate: validatedEndDate } = getDashboardSchema.parse({period, startDate, endDate})
            const revenueChartData = await dashboardService.getRevenueChartData(validatedPeriod, validatedStartDate, validatedEndDate);
            res.json(revenueChartData);
        } catch (error) {
            next(error);
        }
    },

    getBookingHeatmap: async (req, res, next) => {
        try {
            const bookingHeatmap = await dashboardService.getBookingHeatmap();
            res.json(bookingHeatmap);
        } catch (error) {
            next(error);
        }
    },
};

export default dashboardController;