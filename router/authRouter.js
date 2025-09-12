import express from "express";
import { signIn, login } from "./../controller/authController.js";

const router = express.Router();

router.post("/signup", signIn);
router.post("/login", login);
export default router;
