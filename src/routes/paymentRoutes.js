const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

const paymentRoutes = () => {
    router.post('/create-order', authMiddleware, paymentController.createPaymentOrder);
    router.post('/verify-payment', paymentController.verifyPayment);
    
    return router
};


module.exports = paymentRoutes;
