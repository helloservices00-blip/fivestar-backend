import express from "express";
import Subcategory from "../models/Subcategory.js";
import Category from "../models/Category.js";

const router = express.Router();

// CREATE subcategory
router.post("/", async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ message: "Category not found" });

    const subcategory = await Subcategory.create({ name, category: categoryId });
    res.status(201).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all subcategories (optionally by category)
router.get("/", async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter = categoryId ? { category: categoryId } : {};
    const subcategories = await Subcategory.find(filter).populate("category", "name");
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single subcategory
router.get("/:id", async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id).populate("category", "name");
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });
    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE subcategory
router.put("/:id", async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) return res.status(400).json({ message: "Category not found" });
    }
    const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, { name, category: categoryId }, { new: true });
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });
    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE subcategory
router.delete("/:id", async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });
    res.json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
