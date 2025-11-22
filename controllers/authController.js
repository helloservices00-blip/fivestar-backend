import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password, role });

        res.status(201).json({
            token: generateToken(user),
            user
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        res.status(200).json({
            token: generateToken(user),
            user
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
