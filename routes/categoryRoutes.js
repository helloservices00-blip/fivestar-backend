import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// CREATE CATEGORY
router.post("/", async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      module: req.body.module,
    });

    const saved = await category.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().populate("module");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
