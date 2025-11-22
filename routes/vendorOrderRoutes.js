import express from "express";
import { vendorAuth } from "../middleware/vendorAuth.js";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * --------------------------------------------------------
 * 1. GET all orders that contain THIS vendor's products
 * --------------------------------------------------------
 */
router.get("/", vendorAuth, async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    // Find orders that include items belonging to this vendor
    const orders = await Order.find({ "items.vendorId": vendorId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    // Filter only the vendor items inside the order
    const vendorOrders = orders.map(order => {
      const vendorItems = order.items.filter(
        item => item.vendorId.toString() === vendorId
      );

      return {
        orderId: order._id,
        userId: order.userId,
        items: vendorItems,
        createdAt: order.createdAt
      };
    });

    res.json(vendorOrders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * --------------------------------------------------------
 * 2. UPDATE order item status (only vendor's own items)
 * --------------------------------------------------------
 * Example statuses:
 * "Pending", "Accepted", "Packed", "Shipped", "Delivered", "Cancelled"
 * --------------------------------------------------------
 */
router.put("/item/:orderId/:itemId", vendorAuth, async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Select the specific item
    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Verify vendor ownership
    if (item.vendorId.toString() !== req.vendor.id)
      return res.status(403).json({ message: "Not allowed" });

    // Update item status
    item.status = status;

    await order.save();

    res.json({
      message: "Order item status updated successfully",
      item
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
