import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// Admin get all users
router.get("/", protect, admin, getUsers);

// Admin get single user
router.get("/:id", protect, admin, getUserById);

// Admin update user
router.put("/:id", protect, admin, updateUser);

// Admin delete user
router.delete("/:id", protect, admin, deleteUser);

export default router;
