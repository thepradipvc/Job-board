import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logoutUser);

export default router;
