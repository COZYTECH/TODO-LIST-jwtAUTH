import { signUpSchema } from "../middleware/validation.js";
import User from "../model/userModel.js";
import doHash from "../utils/hash.js";
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
