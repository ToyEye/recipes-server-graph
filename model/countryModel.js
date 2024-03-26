import { Schema, model } from "mongoose";

const countrySchema = new Schema(
  {
    country: {
      type: String,
      required: true,
    },
    description: { type: String },
  },
  { versionKey: false }
);

export const Country = model("country", countrySchema);
