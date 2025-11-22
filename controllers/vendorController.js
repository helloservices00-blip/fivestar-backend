import Vendor from '../models/Vendor.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// Create vendor profile
export const createVendor = async (req, res) => {
    try {
        const { shopName } = req.body;
        const userId = req.user.id;

        const existing = await Vendor.findOne({ user: userId });
        if (existing) return res.status(400).json({ message: 'Vendor already exists' });

        const vendor = await Vendor.create({ user: userId, shopName });
        res.status(201).json(vendor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Approve vendor (Admin only)
export const approveVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        vendor.approved = true;
        await vendor.save();
        res.status(200).json(vendor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// List all vendors
export const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('user', 'name email');
        res.status(200).json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
