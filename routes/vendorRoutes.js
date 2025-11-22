import express from "express";
import Vendor from "../models/Vendor.js";
import Module from "../models/Module.js";

const router = express.Router();

// CREATE vendor
router.post("/", async (req, res) => {
  try {
    const { name, moduleIds } = req.body;

    const modules = await Module.find({ _id: { $in: moduleIds || [] } });
    const vendor = await Vendor.create({ name, modules: modules.map(m => m._id) });

    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all vendors
router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("modules", "name");
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single vendor
router.get("/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate("modules", "name");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE vendor
router.put("/:id", async (req, res) => {
  try {
    const { name, moduleIds } = req.body;
    const modules = moduleIds ? await Module.find({ _id: { $in: moduleIds } }) : [];

    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { name, modules: modules.map(m => m._id) },
      { new: true }
    );

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE vendor
router.delete("/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
