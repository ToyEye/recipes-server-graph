import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: { type: String, require: true, minLength: 6 },
    token: { type: String, default: null },
    verify: { type: Boolean, default: false },
    verifyCode: { type: String },
  },
  { versionKey: false, timestamps: true }
);

export const User = model("user", userSchema);
