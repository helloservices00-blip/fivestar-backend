import express from "express";
import Category from "../models/Category.js"; // Make sure this exists
import { isAdmin } from "../middleware/auth.js"; // optional: protect admin routes

const router = express.Router();

/* ===========================
   GET all categories
=========================== */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===========================
   GET single category
=========================== */
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===========================
   CREATE new category (admin only)
=========================== */
router.post("/", isAdmin, async (req, res) => {
  try {
    const { name, subcategories } = req.body;
    const newCategory = new Category({ name, subcategories });
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===========================
   ADD subcategory to existing category (admin only)
=========================== */
router.post("/:id/subcategory", isAdmin, async (req, res) => {
  try {
    const { subcategory } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.subcategories.push(subcategory);
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===========================
   UPDATE category (admin only)
=========================== */
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const { name, subcategories } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, subcategories },
      { new: true }
    );
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===========================
   DELETE category (admin only)
=========================== */
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
