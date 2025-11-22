import express from "express";
import { createProduct, getVendorProducts } from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/vendor/:vendorId", getVendorProducts);

export default router;
