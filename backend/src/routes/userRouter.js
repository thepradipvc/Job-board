import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getMe);

export default router;
