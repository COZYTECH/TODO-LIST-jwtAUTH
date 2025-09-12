import { signUpSchema, loginInSchema } from "../middleware/validation.js";
import User from "../model/userModel.js";
import doHash from "../utils/hash.js";
import { doHashValidation } from "../utils/hash.js";
import jwt from "jsonwebtoken";

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signUpSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await doHash(password, 12);

    const newUser = await User({ email, password: hashedPassword });
    const result = await newUser.save();
    result.password = undefined;
    res
      .status(201)
      .json({ success: true, message: "user created successfully", result });
  } catch (err) {
    console.log(err);
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = loginInSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const result = await doHashValidation(password, existingUser.password);
    if (!result) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      },
      process.env.TOKEN_KEY,
      { expiresIn: "8h" }
    );
    res
      .cookie("Authorization", "Bearer" + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.log(err);
  }
};
