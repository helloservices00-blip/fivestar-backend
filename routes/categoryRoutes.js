import express from "express";
import Category from "../models/Category.js";
import Module from "../models/Module.js";

const router = express.Router();

// CREATE category
router.post("/", async (req, res) => {
  try {
    const { name, moduleId } = req.body;

    const module = await Module.findById(moduleId);
    if (!module) return res.status(400).json({ message: "Module not found" });

    const category = await Category.create({ name, module: moduleId });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all categories (optionally by module)
router.get("/", async (req, res) => {
  try {
    const { moduleId } = req.query;
    const filter = moduleId ? { module: moduleId } : {};
    const categories = await Category.find(filter).populate("module", "name");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("module", "name");
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE category
router.put("/:id", async (req, res) => {
  try {
    const { name, moduleId } = req.body;
    if (moduleId) {
      const module = await Module.findById(moduleId);
      if (!module) return res.status(400).json({ message: "Module not found" });
    }
    const category = await Category.findByIdAndUpdate(req.params.id, { name, module: moduleId }, { new: true });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE category
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
