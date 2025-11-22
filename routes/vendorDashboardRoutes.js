import express from "express";
import Product from "../models/Product.js";
import Vendor from "../models/Vendor.js";
import { verifyVendor } from "../middlewares/authMiddleware.js"; // example auth middleware

const router = express.Router();

// GET all products for logged-in vendor
router.get("/products", verifyVendor, async (req, res) => {
  try {
    const vendorId = req.vendor._id; // get vendor ID from auth middleware

    // Find all products belonging to this vendor
    const products = await Product.find({ vendor: vendorId })
      .populate("module", "name")
      .populate("category", "name")
      .populate("subcategory", "name");

    res.json(products);
  } catch (err) {
    console.error("Error fetching vendor products:", err);
    res.status(500).json({ message: "Error fetching products", error: err });
  }
});

export default router;
