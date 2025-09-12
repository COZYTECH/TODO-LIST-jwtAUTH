import express from "express";
import {
  signIn,
  login,
  signOut,
  changePassword,
} from "./../controller/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", signIn);
router.post("/login", login);
router.post("/signout", signOut);
router.post("/change-password", verifyToken, changePassword);
export default router;
