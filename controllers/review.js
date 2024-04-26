import { Review } from "../model/index.js";

export const addReview = async (
  _,
  { author, description, recipeId },
  { user }
) => {
  if (!user) throw new Error("Unauthorized!");

  const newReview = new Review({
    author,
    description,
    recipeId,
    owner: user._id,
  });

  return newReview.save();
};

export const deleteReview = async (_, { id }, { user }) => {
  if (!user) throw new Error("Unauthorized!");
  return Review.findOneAndDelete({ _id: id, owner: user._id });
};

export const updateReview = async (
  _,
  { author, description, id },
  { user }
) => {
  if (!user) throw new Error("Unauthorized!");

  return Review.findByIdAndUpdate(
    { _id: id, owner: user._id },
    { $set: { author, description } },
    { new: true }
  );
};
