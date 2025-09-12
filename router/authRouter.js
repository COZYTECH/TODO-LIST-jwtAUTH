import express from "express";
import { signIn } from "./../controller/authController.js";

const router = express.Router();

router.post("/signup", signIn);

export default router;
