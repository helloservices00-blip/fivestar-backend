// routes/userRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

router.get("/all-users", protect, admin, async (req, res) => {
  // Admin-only route
});

export default router;
