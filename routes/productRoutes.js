import express from "express";
import Product from "../models/Product.js";
import Vendor from "../models/Vendor.js";

const router = express.Router();

// Upload new product
router.post("/", async (req, res) => {
  try {
    const { name, price, description, image, vendorId, moduleId, categoryId, subcategoryId } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !price || !vendorId || !moduleId || !categoryId || !subcategoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2️⃣ Create product
    const product = await Product.create({
      name,
      price,
      description,
      image,
      vendor: vendorId,
      module: moduleId,
      category: categoryId,
      subcategory: subcategoryId
    });

    // 3️⃣ Add product to vendor's products array
    const vendor = await Vendor.findById(vendorId);
    if (vendor) {
      vendor.products.push(product._id);
      await vendor.save();
    }

    // 4️⃣ Populate references before sending response
    const populatedProduct = await Product.findById(product._id)
      .populate("vendor", "shopName")
      .populate("module", "name")
      .populate("category", "name")
      .populate("subcategory", "name");

    res.status(201).json(populatedProduct);

  } catch (err) {
    console.error("Error uploading product:", err);
    res.status(500).json({ message: "Error uploading product", error: err });
  }
});

export default router;
