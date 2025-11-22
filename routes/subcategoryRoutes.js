import express from "express";
import SubCategory from "../models/SubCategory.js";

const router = express.Router();

// CREATE SUBCATEGORY
router.post("/", async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "Name & category required" });
    }

    const sub = new SubCategory({ name, category });
    await sub.save();

    res.json({ message: "Subcategory created", sub });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SUBCATEGORIES BY CATEGORY
router.get("/:categoryId", async (req, res) => {
  try {
    const subs = await SubCategory.find({ category: req.params.categoryId });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
