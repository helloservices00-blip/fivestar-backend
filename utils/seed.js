import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import Module from "../models/Module.js";
import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";
import Product from "../models/Product.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    console.log("MongoDB connected for seeding...");

    // Clear collections
    await User.deleteMany();
    await Vendor.deleteMany();
    await Module.deleteMany();
    await Category.deleteMany();
    await Subcategory.deleteMany();
    await Product.deleteMany();

    // 1️⃣ Users
    const user = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456", // hash in real production
      isAdmin: true
    });

    // 2️⃣ Vendors & Modules
    const modulesData = [
      { name: "Hyderabadi Biryani House" },
      { name: "Pizza Planet" },
      { name: "Fashion Hub" }
    ];
    const modules = await Module.insertMany(modulesData);

    const vendorsData = [
      { user: user._id, shopName: "Hyderabadi Biryani House", email: "biryani@example.com", approved: true },
      { user: user._id, shopName: "Pizza Planet", email: "pizza@example.com", approved: true },
      { user: user._id, shopName: "Fashion Hub", email: "fashion@example.com", approved: true }
    ];
    const vendors = await Vendor.insertMany(vendorsData);

    // 3️⃣ Categories & Subcategories
    const categoriesData = [
      { name: "Biryani", module: modules[0]._id },
      { name: "Snacks", module: modules[0]._id },
      { name: "Pizza", module: modules[1]._id },
      { name: "Beverages", module: modules[1]._id },
      { name: "Men's Clothing", module: modules[2]._id },
      { name: "Women's Clothing", module: modules[2]._id }
    ];
    const categories = await Category.insertMany(categoriesData);

    const subcategoriesData = [
      { name: "Non-Veg", category: categories[0]._id },
      { name: "Veg", category: categories[0]._id },
      { name: "Chaat", category: categories[1]._id },
      { name: "Fried", category: categories[1]._id },
      { name: "Cheese", category: categories[2]._id },
      { name: "Pepperoni", category: categories[2]._id },
      { name: "Cold Drinks", category: categories[3]._id },
      { name: "Hot Drinks", category: categories[3]._id },
      { name: "Casual", category: categories[4]._id },
      { name: "Formal", category: categories[4]._id },
      { name: "Casual", category: categories[5]._id },
      { name: "Formal", category: categories[5]._id }
    ];
    const subcategories = await Subcategory.insertMany(subcategoriesData);

    // 4️⃣ Products
    const productsData = [
      {
        name: "Hyderabadi Biryani Special",
        price: 250,
        description: "Authentic spicy biryani",
        image: "/images/biryani.jpg",
        vendor: vendors[0]._id,
        module: modules[0]._id,
        category: categories[0]._id,
        subcategory: subcategories[0]._id
      },
      {
        name: "Veg Biryani",
        price: 200,
        description: "Delicious veg biryani",
        image: "/images/veg_biryani.jpg",
        vendor: vendors[0]._id,
        module: modules[0]._id,
        category: categories[0]._id,
        subcategory: subcategories[1]._id
      },
      {
        name: "Margherita Pizza",
        price: 300,
        description: "Cheesy delight",
        image: "/images/pizza.jpg",
        vendor: vendors[1]._id,
        module: modules[1]._id,
        category: categories[2]._id,
        subcategory: subcategories[4]._id
      },
      {
        name: "Pepperoni Pizza",
        price: 350,
        description: "Classic pepperoni pizza",
        image: "/images/pepperoni_pizza.jpg",
        vendor: vendors[1]._id,
        module: modules[1]._id,
        category: categories[2]._id,
        subcategory: subcategories[5]._id
      },
      {
        name: "Men's Casual Shirt",
        price: 1200,
        description: "Comfortable cotton shirt",
        image: "/images/mens_casual.jpg",
        vendor: vendors[2]._id,
        module: modules[2]._id,
        category: categories[4]._id,
        subcategory: subcategories[8]._id
      },
      {
        name: "Women's Formal Dress",
        price: 1800,
        description: "Elegant formal dress",
        image: "/images/womens_formal.jpg",
        vendor: vendors[2]._id,
        module: modules[2]._id,
        category: categories[5]._id,
        subcategory: subcategories[11]._id
      }
    ];

    const products = await Product.insertMany(productsData);

    // Link products to vendors
    for (let i = 0; i < vendors.length; i++) {
      const vendorProducts = products.filter(p => p.vendor.toString() === vendors[i]._id.toString());
      vendors[i].products = vendorProducts.map(p => p._id);
      await vendors[i].save();
    }

    console.log("Database seeded successfully!");
    process.exit(0);

  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seed();
