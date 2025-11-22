import express from 'express';
import { createOrder, getOrders, getAllOrders } from '../controllers/orderController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create order (customer)
router.post('/', protect, createOrder);

// Get orders for logged-in user
router.get('/', protect, getOrders);

// Get all orders (admin)
router.get('/all', protect, admin, getAllOrders);

export default router;
