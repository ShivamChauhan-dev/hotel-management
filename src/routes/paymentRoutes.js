import express from 'express';
const router = express.Router();
import * as paymentController from '../controllers/paymentController.js';
import  authMiddleware from '../middleware/authMiddleware.js';

router.post('/create-order', authMiddleware, paymentController.createPaymentOrder);
router.post('/verify-payment', paymentController.verifyPayment);



export default router;
