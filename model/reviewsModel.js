import { Schema, model } from "mongoose";

const reviewsSchema = new Schema(
  {
    author: {
      type: String,
      default: "Anonymous",
    },
    description: {
      type: String,
      required: true,
    },
    recipeId: { type: String, required: true },
    owner: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

export const Review = model("review", reviewsSchema);
