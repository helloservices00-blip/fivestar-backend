import express from "express";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import Module from "../models/Module.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/full-seed", async (req, res) => {
  try {
    // 0️⃣ Clear existing data
    await Product.deleteMany({});
    await SubCategory.deleteMany({});
    await Category.deleteMany({});
    await Module.deleteMany({});
    await Vendor.deleteMany({});
    await User.deleteMany({});

    // 1️⃣ Create dummy user
    const dummyUser = await User.create({
      name: "Seed User",
      email: "seeduser@example.com",
      password: "123456" // Make sure you hash in real app
    });

    // 2️⃣ Vendors
    const vendors = await Vendor.insertMany([
      {
        name: "Hyderabadi Biryani House",
        shopName: "Biryani House",
        user: dummyUser._id
      },
      {
        name: "Pizza Planet",
        shopName: "Pizza Planet Shop",
        user: dummyUser._id
      },
      {
        name: "Fashion Hub",
        shopName: "Fashion Hub Store",
        user: dummyUser._id
      }
    ]);

    // 3️⃣ Modules
    const modules = await Module.insertMany([
      { name: "Food" },
      { name: "Electronics" },
      { name: "Fashion" }
    ]);

    // 4️⃣ Categories
    const categories = await Category.insertMany([
      { name: "Biryani", module: modules.find(m => m.name === "Food")._id },
      { name: "Pizza", module: modules.find(m => m.name === "Food")._id },
      { name: "Mobiles", module: modules.find(m => m.name === "Electronics")._id },
      { name: "Laptops", module: modules.find(m => m.name === "Electronics")._id },
      { name: "Men's Clothing", module: modules.find(m => m.name === "Fashion")._id },
      { name: "Women's Clothing", module: modules.find(m => m.name === "Fashion")._id }
    ]);

    // 5️⃣ Subcategories
    const subcategories = await SubCategory.insertMany([
      { name: "Non-Veg", category: categories.find(c => c.name === "Biryani")._id },
      { name: "Veg", category: categories.find(c => c.name === "Pizza")._id },
      { name: "Smartphones", category: categories.find(c => c.name === "Mobiles")._id },
      { name: "Gaming Laptops", category: categories.find(c => c.name === "Laptops")._id },
      { name: "Casual", category: categories.find(c => c.name === "Men's Clothing")._id },
      { name: "Formal", category: categories.find(c => c.name === "Women's Clothing")._id }
    ]);

    // 6️⃣ Products
    const products = await Product.insertMany([
      {
        name: "Hyderabadi Biryani",
        price: 250,
        description: "Delicious spicy biryani",
        vendor: vendors.find(v => v.name === "Hyderabadi Biryani House")._id,
        module: modules.find(m => m.name === "Food")._id,
        category: categories.find(c => c.name === "Biryani")._id,
        subcategory: subcategories.find(s => s.name === "Non-Veg")._id,
        image: "/images/biryani.jpg"
      },
      {
        name: "Margherita Pizza",
        price: 300,
        description: "Cheesy delight",
        vendor: vendors.find(v => v.name === "Pizza Planet")._id,
        module: modules.find(m => m.name === "Food")._id,
        category: categories.find(c => c.name === "Pizza")._id,
        subcategory: subcategories.find(s => s.name === "Veg")._id,
        image: "/images/pizza.jpg"
      },
      {
        name: "iPhone 15",
        price: 120000,
        description: "Latest Apple smartphone",
        vendor: vendors.find(v => v.name === "Fashion Hub")._id,
        module: modules.find(m => m.name === "Electronics")._id,
        category: categories.find(c => c.name === "Mobiles")._id,
        subcategory: subcategories.find(s => s.name === "Smartphones")._id,
        image: "/images/iphone.jpg"
      }
    ]);

    res.json({
      message: "Full seed completed ✅",
      dummyUser,
      vendors,
      modules,
      categories,
      subcategories,
      products
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error seeding database", error: err.message });
  }
});

export default router;
