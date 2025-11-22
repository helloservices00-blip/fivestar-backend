import Product from "../models/Product.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      vendor,
      module,
      category,
      subcategory,
      name,
      description,
      price,
      stock,
      images
    } = req.body;

    if (!vendor || !module || !category || !subcategory) {
      return res.status(400).json({ message: "Module, category, subcategory and vendor are required" });
    }

    const product = await Product.create({
      vendor,
      module,
      category,
      subcategory,
      name,
      description,
      price,
      stock,
      images,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("module")
      .populate("category")
      .populate("subcategory")
      .populate("vendor");

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("module")
      .populate("category")
      .populate("subcategory")
      .populate("vendor");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
