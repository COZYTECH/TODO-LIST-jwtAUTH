import express from "express";
import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getSingleTask,
} from "../controller/taskController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-task", verifyToken, createTask);
router.get("/tasks", getAllTasks);
router.put("/update-task", verifyToken, updateTask);
router.delete("/delete-task", verifyToken, deleteTask);
router.get("/get-single-task", verifyToken, getSingleTask);

export default router;
