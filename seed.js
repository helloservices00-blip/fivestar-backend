import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";

dotenv.config();

const categories = [
  {
    name: "Electronics",
    subcategories: ["Mobiles", "Laptops", "Cameras"],
  },
  {
    name: "Clothing",
    subcategories: ["Men", "Women", "Kids"],
  },
  {
    name: "Home Appliances",
    subcategories: ["Kitchen", "Living Room", "Bedroom"],
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await Category.deleteMany(); // optional: clear existing categories
    await Category.insertMany(categories);
    console.log("Seed data added successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
