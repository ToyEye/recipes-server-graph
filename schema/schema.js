import graphql from "graphql";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLBoolean,
} = graphql;

import { Recipe, Country, Review } from "../model/index.js";
import { user, recipe, review, countries } from "../controllers/index.js";

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

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    token: { type: GraphQLString },
    verify: { type: GraphQLBoolean },
    verifyCode: { type: GraphQLString },
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
      resolve: recipe.addRecipe,
    },
    deleteRecipe: {
      type: RecipeType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: recipe.deleteRecipe,
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
      resolve: recipe.updateRecipe,
    },
    addReview: {
      type: ReviewType,
      args: {
        author: { type: GraphQLString },
        description: { type: GraphQLString },
        recipeId: { type: GraphQLString },
      },
      resolve: review.addReview,
    },
    deleteReview: {
      type: ReviewType,
      args: { id: { type: GraphQLID } },
      resolve: review.deleteReview,
    },
    updateReview: {
      type: ReviewType,
      args: {
        author: { type: GraphQLString },
        description: { type: GraphQLString },
        id: { type: GraphQLID },
      },
      resolve: review.updateReview,
    },
    signup: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: user.signup,
    },
    signin: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },

      resolve: user.signin,
    },
    logout: {
      type: UserType,
      resolve: user.logout,
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
      resolve: recipe.getRecipe,
    },
    recipes: {
      type: new GraphQLList(RecipeType),
      resolve: recipe.getAllRecipes,
    },
    countries: {
      type: GraphQLList(CountryType),
      resolve: () => {
        return countries.getCountries;
      },
    },
    country: {
      type: CountryType,
      args: {
        country: { type: GraphQLString },
      },
      resolve: countries.getCountry,
    },
    current: {
      type: UserType,
      resolve: user.getCurrentUser,
    },
  },
});

export default new GraphQLSchema({ query: Query, mutation: Mutation });
