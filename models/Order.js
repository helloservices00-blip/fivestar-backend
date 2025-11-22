import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref:'Vendor', required: true },
    products: [{ product: {type: mongoose.Schema.Types.ObjectId, ref:'Product'}, quantity: Number }],
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending','shipped','delivered','cancelled'], default: 'pending' },
    paymentStatus: { type: String, enum: ['paid','unpaid'], default: 'unpaid' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
