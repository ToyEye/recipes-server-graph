import graphql from "graphql";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
} = graphql;

import { user, recipe, review, countries } from "../controllers/index.js";
import {
  RecipeType,
  CountryType,
  ReviewType,
  UserType,
} from "../ghTypes/ghTypes.js";

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
    changeVote: {
      type: RecipeType,
      args: { id: { type: GraphQLID }, newVote: { type: GraphQLString } },
      resolve: recipe.changeVote,
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
        confirmPassword: { type: GraphQLString },
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
    getRandomRecipes: {
      type: new GraphQLList(RecipeType),
      resolve: recipe.getRandomRecipes,
    },
    countries: {
      type: GraphQLList(CountryType),
      resolve: countries.getCountries,
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
