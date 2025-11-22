import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create order
export const createOrder = async (req, res) => {
    try {
        const { products } = req.body; // [{product: id, quantity}]
        let total = 0;
        const vendorId = products[0].vendor;

        // Calculate total
        for (let item of products) {
            const product = await Product.findById(item.product);
            total += product.price * item.quantity;
        }

        const order = await Order.create({
            user: req.user.id,
            vendor: vendorId,
            products,
            total
        });

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all orders for user
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('products.product').populate('vendor', 'shopName');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').populate('vendor', 'shopName').populate('products.product');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
