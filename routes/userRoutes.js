import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Get current user info
router.get('/me', protect, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
});

export default router;
