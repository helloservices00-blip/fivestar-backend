// routes/vendorDashboardRoutes.js
import express from "express";
import Product from "../models/Product.js";
import { verifyVendor } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/products", verifyVendor, async (req, res) => {
  const vendorId = req.vendor._id;
  const products = await Product.find({ vendor: vendorId })
    .populate("module", "name")
    .populate("category", "name")
    .populate("subcategory", "name");

  res.json(products);
});

export default router;
