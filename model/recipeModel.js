import { model, Schema } from "mongoose";

const recipeSchema = new Schema(
  {
    name: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

export const Recipe = model("recipe", recipeSchema);
