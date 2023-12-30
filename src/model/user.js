//user model
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
    phone: {
      type: "number",
      required: true,
    },
    institute: {
      type: "string",
      required: true,
    },
    degree: {
      type: "string",
      required: true,
    },
    DOB: {
      type: "string",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
