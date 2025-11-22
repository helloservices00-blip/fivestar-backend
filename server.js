import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import vendorDashboardRoutes from "./routes/vendorDashboardRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subcategoryRoutes from "./routes/subcategoryRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MAIN ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);

// MODULE / CATEGORY / SUBCATEGORY
app.use("/api/modules", moduleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);

// VENDOR DASHBOARD
app.use("/api/vendor/dashboard", vendorDashboardRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Multi-Vendor Backend is running!");
});

// DATABASE & SERVER
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => console.error("MongoDB connection error:", err));
