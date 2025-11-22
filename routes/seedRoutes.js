// routes/seedRoutes.js
import express from "express";
import Module from "../models/Module.js";

const router = express.Router();

router.get("/seed-modules", async (req, res) => {
  try {
    // Clear existing modules (optional)
    await Module.deleteMany({});

    // Sample modules
    const modules = [
      { name: "Food" },
      { name: "Electronics" },
      { name: "Fashion" },
      { name: "Beauty" },
      { name: "Grocery" },
      { name: "Home" }
    ];

    const createdModules = await Module.insertMany(modules);

    res.json({ message: "Modules added to MongoDB ✅", createdModules });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error seeding modules" });
  }
});

export default router;
