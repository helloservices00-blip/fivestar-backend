import express from "express";
import Module from "../models/Module.js";

const router = express.Router();

// CREATE module
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const module = await Module.create({ name });
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all modules
router.get("/", async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single module
router.get("/:id", async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ message: "Module not found" });
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE module
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const module = await Module.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!module) return res.status(404).json({ message: "Module not found" });
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE module
router.delete("/:id", async (req, res) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);
    if (!module) return res.status(404).json({ message: "Module not found" });
    res.json({ message: "Module deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
