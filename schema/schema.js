import graphql from "graphql";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
} = graphql;

import { Recipe, Country, Review } from "../model/index.js";

const RecipeType = new GraphQLObjectType({
  name: "Recipe",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    ingredients: { type: GraphQLList(GraphQLString) },
    instructions: { type: GraphQLString },
    country: { type: GraphQLString },
    reviews: {
      type: GraphQLList(ReviewType),
      resolve: (parent) => {
        return Review.find({ recipeId: parent.id });
      },
    },
  }),
});

const CountryType = new GraphQLObjectType({
  name: "Country",
  fields: () => ({
    id: { type: GraphQLID },
    country: { type: GraphQLString },
    description: { type: GraphQLString },
    recipes: {
      type: GraphQLList(RecipeType),
      resolve: (parent, args) => {
        return Recipe.find({ country: parent.country });
      },
    },
  }),
});

const ReviewType = new GraphQLObjectType({
  name: "Review",
  fields: () => ({
    id: { type: GraphQLID },
    author: { type: GraphQLString },
    description: { type: GraphQLString },
    recipeId: { type: GraphQLString },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addRecipe: {
      type: RecipeType,
      args: {
        name: { type: GraphQLString },
        ingredients: { type: GraphQLList(GraphQLString) },
        instructions: { type: GraphQLString },
        country: { type: GraphQLString },
      },
      resolve: async (
        parent,
        { name, ingredients, instructions, country },
        context
      ) => {
        if (!context.user) throw new Error("Unauthorized!");

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

            const modernCountry = newCountry.map(
              ({ name: { common }, flags }) => ({
                country: common,
                flag: flags.png,
              })
            );

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
        });

        return newRecipe.save();
      },
    },
    deleteRecipe: {
      type: RecipeType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, { id }, context) => {
        if (context.user) return Recipe.findByIdAndDelete(id);

        throw new Error("Unauthorized!");
      },
    },
    updateRecipe: {
      type: RecipeType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        ingredients: { type: GraphQLList(GraphQLString) },
        instructions: { type: GraphQLString },
        country: { type: GraphQLString },
      },
      resolve: (
        parent,
        { id, name, ingredients, instructions, country },
        context
      ) => {
        if (!context.user) throw new Error("Unauthorized!");

        return Recipe.findByIdAndUpdate(
          id,
          {
            $set: { name, ingredients, instructions, country },
          },
          { new: true }
        );
      },
    },
    addReview: {
      type: ReviewType,
      args: {
        author: { type: GraphQLString },
        description: { type: GraphQLString },
        recipeId: { type: GraphQLString },
      },
      resolve: (parent, { author, description, recipeId }, context) => {
        if (!context.user) throw new Error("Unauthorized!");

        const newReview = new Review({ author, description, recipeId });
        return newReview.save();
      },
    },
    deleteReview: {
      type: ReviewType,
      args: { id: { type: GraphQLID } },
      resolve: (_, { id }, context) => {
        if (!context.user) throw new Error("Unauthorized!");

        return Review.findByIdAndDelete(id);
      },
    },
    updateReview: {
      type: ReviewType,
      args: {
        author: { type: GraphQLString },
        description: { type: GraphQLString },
        id: { type: GraphQLID },
      },
      resolve: (_, { author, description, id }, context) => {
        if (!context.user) throw new Error("Unauthorized!");

        return Review.findByIdAndUpdate(
          id,
          { $set: { author, description } },
          { new: true }
        );
      },
    },
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    recipe: {
      type: RecipeType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: (parent, args) => {
        return Recipe.findById(args.id);
      },
    },
    recipes: {
      type: new GraphQLList(RecipeType),
      resolve: () => {
        return Recipe.find({});
      },
    },
    countries: {
      type: GraphQLList(CountryType),
      resolve: () => {
        return Country.find({});
      },
    },
    country: {
      type: CountryType,
      args: {
        country: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return Country.findOne({ country: args.country });
      },
    },
  },
});

export default new GraphQLSchema({ query: Query, mutation: Mutation });
