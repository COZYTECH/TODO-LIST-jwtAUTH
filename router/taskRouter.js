import express from "express";
import { createTask } from "../controller/taskController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-task", verifyToken, createTask);

export default router;
