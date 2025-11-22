import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("vendor", "shopName")      // vendor name
      .populate("module", "name")          // module name
      .populate("category", "name")        // category name
      .populate("subcategory", "name");   // subcategory name

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
});

export default router;
