import {
  signUpSchema,
  loginInSchema,
  changePasswordSchema,
} from "../middleware/validation.js";
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

export const signOut = (req, res) => {
  res.clearCookie("Authorization", {
    httpOnly: true,
    secure: false, // i set this to false for testing in postman
  });
  res.json({ success: true, message: "Signout successful" });
};

export const changePassword = async (req, res) => {
  //   const userId = req.User;
  const userId = req.user?.userId;
  const { oldPassword, newPassword } = req.body;
  try {
    const { error, value } = changePasswordSchema.validate({
      oldPassword,
      newPassword,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const existingUser = await User.findOne({ _id: userId }).select(
      "+password"
    );
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exist" });
    }
    const passwordMatch = await doHashValidation(
      oldPassword,
      existingUser.password
    );
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Old password is incorrect" });
    }
    const hashedPassword = await doHash(newPassword, 12);
    existingUser.password = hashedPassword;
    await existingUser.save();
    return res
      .status(200)
      .json({ success: true, message: "passsword updated" });
  } catch (err) {
    console.log(err);
  }
};
