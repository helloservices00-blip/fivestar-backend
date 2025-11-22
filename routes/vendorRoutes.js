import express from 'express';
import { createVendor, getVendors, approveVendor } from '../controllers/vendorController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create vendor profile (authenticated)
router.post('/', protect, createVendor);

// List all vendors
router.get('/', protect, getVendors);

// Approve vendor (Admin only)
router.patch('/approve/:id', protect, admin, approveVendor);

export default router;
