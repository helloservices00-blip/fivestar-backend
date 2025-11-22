import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

// CREATE PRODUCT
router.post("/", createProduct);

// GET ALL PRODUCTS
router.get("/", getProducts);

// GET ONE PRODUCT
router.get("/:id", getProductById);

export default router;
