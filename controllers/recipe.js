import { calculateRating } from "../helpers/calculateRating.js";
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

  return Recipe.findOneAndDelete({ _id: id, owner: user._id });
};

export const updateRecipe = async (
  _,
  { id, name, ingredients, instructions, country },
  { user }
) => {
  if (!user) throw new Error("Unauthorized!");

  return Recipe.findOneAndUpdate(
    { _id: id, owner: user._id },
    {
      $set: { name, ingredients, instructions, country },
    },
    { new: true }
  );
};

export const changeVote = async (_, { id, newVote }) => {
  const recipe = await Recipe.findById(id, "vote_count vote_bank");

  const newBody = {
    vote_count: recipe.vote_count + 1,
    vote_average: calculateRating(recipe.vote_bank),
    vote_bank: {
      ...recipe.vote_bank,
      [newVote]: recipe.vote_bank[newVote] + 1,
    },
  };
  console.log("newBody", newBody);
  return await Recipe.findByIdAndUpdate(id, newBody);
};

export const getRandomRecipes = async () => {
  const recipes = await Recipe.find({});

  if (recipes.length < 3) {
    return "Массив должен содержать как минимум 3 элемента";
  }

  let randomElements = [];

  while (randomElements.length < 3) {
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const randomRecipe = recipes[randomIndex];

    if (!randomElements.some((recipe) => recipe._id === randomRecipe._id)) {
      randomElements.push(randomRecipe);
    }
  }

  return randomElements;
};
