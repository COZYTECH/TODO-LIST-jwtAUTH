import mongoose from "mongoose";

export const userDataSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      min: 5,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userDataSchema);
export default User;
