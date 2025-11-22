import Product from "../models/Product.js";
import Vendor from "../models/Vendor.js";
import Module from "../models/Module.js";
import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";
import mongoose from "mongoose";

// CREATE product
export const createProduct = async (req, res) => {
  try {
    const { name, vendorId, moduleId, categoryId, subcategoryId, price, variants } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(400).json({ message: "Vendor not found" });

    const module = await Module.findById(moduleId);
    if (!module) return res.status(400).json({ message: "Module not found" });

    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ message: "Category not found" });

    let subcategory = null;
    if (subcategoryId) {
      subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) return res.status(400).json({ message: "Subcategory not found" });
    }

    const product = await Product.create({
      name,
      vendor: vendorId,
      module: moduleId,
      category: categoryId,
      subcategory: subcategoryId || null,
      price,
      variants: variants || []
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all products by vendor with hierarchy
export const getVendorProducts = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const hierarchy = await Module.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "module",
          as: "categories"
        }
      },
      { $unwind: { path: "$categories", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "subcategories",
          localField: "categories._id",
          foreignField: "category",
          as: "categories.subcategories"
        }
      },
      {
        $lookup: {
          from: "products",
          let: { categoryId: "$categories._id", moduleId: "$_id" },
          pipeline: [
            { $match: { $expr: {
                $and: [
                  { $eq: ["$category", "$$categoryId"] },
                  { $eq: ["$module", "$$moduleId"] },
                  { $eq: ["$vendor", mongoose.Types.ObjectId(vendorId)] },
                  { $eq: ["$subcategory", null] }
                ]
              } 
            }}
          ],
          as: "categories.products"
        }
      },
      { $unwind: { path: "$categories.subcategories", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          let: { subcategoryId: "$categories.subcategories._id", moduleId: "$_id", categoryId: "$categories._id" },
          pipeline: [
            { $match: { $expr: {
                $and: [
                  { $eq: ["$subcategory", "$$subcategoryId"] },
                  { $eq: ["$module", "$$moduleId"] },
                  { $eq: ["$category", "$$categoryId"] },
                  { $eq: ["$vendor", mongoose.Types.ObjectId(vendorId)] }
                ]
              } 
            }}
          ],
          as: "categories.subcategories.products"
        }
      },
      {
        $group: {
          _id: "$categories._id",
          name: { $first: "$categories.name" },
          moduleId: { $first: "$_id" },
          subcategories: { $push: "$categories.subcategories" },
          products: { $first: "$categories.products" }
        }
      },
      {
        $group: {
          _id: "$moduleId",
          name: { $first: "$name" },
          categories: { $push: "$$ROOT" }
        }
      }
    ]);

    res.json(hierarchy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
