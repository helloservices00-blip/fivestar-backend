import express from "express";
import Product from "../models/Product.js";
import { vendorAuth } from "../middleware/vendorAuth.js";

const router = express.Router();

// Add product (Vendor only)
router.post("/add", vendorAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      images,
      moduleId,
      categoryId,
      subCategoryId
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      images,
      moduleId,
      categoryId,
      subCategoryId,
      vendorId: req.vendor.id   // 🔥 Auto assigned vendorId
    });

    await product.save();
    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
