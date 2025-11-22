import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";

export const vendorAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const vendor = await Vendor.findById(decoded.id);

    if (!vendor) {
      return res.status(401).json({ message: "Vendor not found" });
    }

    req.vendor = vendor;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
