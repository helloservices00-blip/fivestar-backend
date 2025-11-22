// middleware/authMiddleware.js
import Vendor from "../models/Vendor.js";
import jwt from "jsonwebtoken";

export const verifyVendor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find vendor by decoded ID
    const vendor = await Vendor.findById(decoded.id);
    if (!vendor) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Add vendor to request object
    req.vendor = vendor;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Unauthorized", error: err });
  }
};
