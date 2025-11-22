import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET products with optional module/vendor filtering
router.get("/", async (req, res) => {
  try {
    const { moduleId, vendorId } = req.query;

    // Build filter object
    const filter = {};
    if (moduleId) filter.module = moduleId;
    if (vendorId) filter.vendor = vendorId;

    // Find products and populate references
    const products = await Product.find(filter)
      .populate("vendor", "shopName")
      .populate("module", "name")
      .populate("category", "name")
      .populate("subcategory", "name");

    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Error fetching products", error: err });
  }
});

export default router;
