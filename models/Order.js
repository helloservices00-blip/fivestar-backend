import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Accepted", "Packed", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema], // multiple vendors inside 1 order
  totalAmount: Number,
  address: Object,
  paymentStatus: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
