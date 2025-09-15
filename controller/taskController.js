import { createTaskSchema } from "./../middleware/validation.js";
import Post from "./../model/taskModel.js";

export const createTask = async (req, res) => {
  const { title, description } = req.body;
  const { userId } = req.user;
  try {
    const { error, value } = createTaskSchema.validate({ title, description });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const newTask = await Post.create({ title, description, userId });
    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    console.log(error);
  }
};
