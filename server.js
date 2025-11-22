import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test API route
app.get("/api", (req, res) => {
  res.json({ message: "Backend API working successfully 🚀" });
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
