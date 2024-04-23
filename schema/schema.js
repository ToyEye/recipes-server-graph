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
      resolve: (parent, { name, ingredients, instructions, country }) => {
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
      resolve: (parent, { id }) => {
        console.log(id);
        return Recipe.findByIdAndDelete(id);
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
      resolve: (parent, { id, name, ingredients, instructions, country }) => {
        return Recipe.findByIdAndUpdate(
          id,
          {
            $set: { name, ingredients, instructions, country },
          },
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
