import { Recipe, Country } from "../model/index.js";

export const getRecipe = (_, args) => {
  return Recipe.findById(args.id);
};

export const getAllRecipes = () => {
  return Recipe.find({});
};

export const addRecipe = async (
  _,
  { name, ingredients, instructions, country },
  { user }
) => {
  if (!user) throw new Error("Unauthorized!");

  const countryExist = await Country.findOne({ country });

  if (!countryExist) {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${country}`
      );
      if (!response.ok) {
        return new Error("Error when requesting country");
      }

      const newCountry = await response.json();

      const modernCountry = newCountry.map(({ name: { common }, flags }) => ({
        country: common,
        flag: flags.png,
      }));

      await Country.create({ ...modernCountry[0] });
    } catch (error) {
      console.log(error.message);
    }
  }

  const newRecipe = new Recipe({
    name,
    ingredients,
    instructions,
    country,
    owner: user._id,
  });

  return newRecipe.save();
};

export const deleteRecipe = async (parent, { id }, { user }) => {
  if (!user) throw new Error("Unauthorized!");

  return Recipe.findOneAndDelete({ id, owner: user._id });
};

export const updateRecipe = async (
  _,
  { id, name, ingredients, instructions, country },
  { user }
) => {
  if (!user) throw new Error("Unauthorized!");

  return Recipe.findOneAndDelete(
    { id, owner: user._id },
    {
      $set: { name, ingredients, instructions, country },
    },
    { new: true }
  );
};
