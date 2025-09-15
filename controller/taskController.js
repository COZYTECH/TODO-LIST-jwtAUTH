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

export const getAllTasks = async (req, res) => {
  const { page } = req.query;
  const postPerPage = 10;
  try {
    let pageNumber = 0;
    if (page <= 1) {
      pageNumber = 0;
    } else {
      pageNumber = page - 1;
    }

    const tasks = await Post.find()
      .sort({ createdAt: -1 })
      .skip(pageNumber * postPerPage)
      .limit(postPerPage)
      .populate({
        path: "userId",
        Select: "email",
      });
    res.status(200).json({ success: true, message: "post", data: tasks });
  } catch (error) {
    console.log(error);
  }
};

export const updateTask = async (req, res) => {
  const { _id } = req.query;
  const { userId } = req.user;
  try {
    const existingTask = await Post.findOne({ _id });
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (existingTask.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this task" });
    }
    existingTask.title = req.body.title || existingTask.title;
    existingTask.description = req.body.description || existingTask.description;
    const updatedTask = await existingTask.save();
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTask = async (req, res) => {
  const { _id } = req.query;
  const { userId } = req.user;
  try {
    const existingTask = await Post.findOne({ _id });
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (existingTask.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this task" });
    }
    await Post.deleteOne({ _id });
    res.status(200).json({
      success: true,
      message: "post deleted",
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSingleTask = async (req, res) => {
  const { _id } = req.query;
  const { userId } = req.user;
  try {
    const existingTask = await Post.findOne({ _id });
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (existingTask.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this task" });
    }

    const singlePost = await Post.findOne({ _id }).populate({
      path: "userId",
      Select: "email",
    });
    res.status(200).json({
      success: true,
      message: "singlePost",
      data: singlePost,
    });
  } catch (error) {
    console.log(error);
  }
};
