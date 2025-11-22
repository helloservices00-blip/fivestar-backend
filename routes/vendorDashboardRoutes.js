import express from "express";
import Vendor from "../models/Vendor.js";
import Product from "../models/Product.js";
import { vendorAuth } from "../middleware/vendorAuth.js";

const router = express.Router();

// --- Routes ---
router.get("/profile", vendorAuth, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.id).select("-password");
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/profile", vendorAuth, async (req, res) => {
  try {
    const updated = await Vendor.findByIdAndUpdate(
      req.vendor.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/products", vendorAuth, async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.vendor.id })
      .populate("moduleId categoryId subCategoryId");

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/products/:id", vendorAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.vendor.id
    });

    if (!product)
      return res.status(403).json({ message: "Not allowed" });

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/products/:id", vendorAuth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendorId: req.vendor.id
    });

    if (!product)
      return res.status(403).json({ message: "Not allowed" });

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
