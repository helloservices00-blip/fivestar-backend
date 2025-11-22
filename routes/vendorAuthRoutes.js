import express from "express";
import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { vendorAuth } from "../middleware/vendorAuth.js";

const router = express.Router();

/**
 * VENDOR REGISTER
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, shopName, shopAddress } = req.body;

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = new Vendor({
      name,
      email,
      password: hashedPassword,
      phone,
      shopName,
      shopAddress,
    });

    await newVendor.save();

    res.json({ message: "Vendor registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering vendor", error });
  }
});

/**
 * VENDOR LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: "Vendor not found" });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: vendor._id, role: "vendor" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      message: "Vendor login successful",
      token,
      vendor,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

/**
 * GET LOGGED-IN VENDOR PROFILE
 */
router.get("/me", vendorAuth, async (req, res) => {
  try {
    res.json(req.vendor); 
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendor profile", error });
  }
});

/**
 * UPDATE LOGGED-IN VENDOR PROFILE
 */
router.put("/update", vendorAuth, async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.vendor._id,
      req.body,
      { new: true }
    );

    res.json(updatedVendor);
  } catch (error) {
    res.status(500).json({ message: "Error updating vendor profile", error });
  }
});

export default router;

