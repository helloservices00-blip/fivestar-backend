import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * --------------------------------------------------------
 * 1. Admin - Get ALL Orders
 * --------------------------------------------------------
 */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * --------------------------------------------------------
 * 2. Admin - Get SINGLE Order by ID
 * --------------------------------------------------------
 */
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.productId")
      .populate("userId", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * --------------------------------------------------------
 * 3. Admin - Filter Orders by Vendor
 * --------------------------------------------------------
 * /api/admin/orders/vendor/:vendorId
 */
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const orders = await Order.find({ "items.vendorId": req.params.vendorId })
      .populate("items.productId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * --------------------------------------------------------
 * 4. Admin - Filter Orders by Status
 * --------------------------------------------------------
 * /api/admin/orders/status/Pending
 */
router.get("/status/:status", async (req, res) => {
  try {
    const status = req.params.status;

    const orders = await Order.find({ "items.status": status })
      .populate("items.productId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * --------------------------------------------------------
 * 5. Admin - Update STATUS of a specific item
 * --------------------------------------------------------
 */
router.put("/:orderId/item/:itemId", async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.status = status;

    await order.save();

    res.json({ message: "Item status updated by Admin", item });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * --------------------------------------------------------
 * 6. Admin - Delete Entire Order
 * --------------------------------------------------------
 */
router.delete("/:orderId", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.orderId);
    res.json({ message: "Order deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
