import express from "express";
import Module from "../models/Module.js";

const router = express.Router();

// CREATE Module
router.post("/", async (req, res) => {
  try {
    const module = new Module(req.body);
    await module.save();
    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all Modules
router.get("/", async (req, res) => {
  try {
    const modules = await Module.find();
    res.status(200).json(modules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
