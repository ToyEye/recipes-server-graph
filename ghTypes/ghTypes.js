import graphql from "graphql";
import { Recipe, Review } from "../model/index.js";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLScalarType,
} = graphql;

const VoteBankType = new GraphQLObjectType({
  name: "VoteBank",
  fields: () => ({
    vote1: { type: GraphQLInt },
    vote2: { type: GraphQLInt },
    vote3: { type: GraphQLInt },
    vote4: { type: GraphQLInt },
    vote5: { type: GraphQLInt },
  }),
});

const VoteAverageUnion = new GraphQLScalarType({
  name: "VoteAverageUnion",
  types: [GraphQLInt, GraphQLFloat],
  resolveType(value) {
    if (Number.isInteger(value)) {
      return GraphQLInt;
    }
    return GraphQLFloat;
  },
});

export const RecipeType = new GraphQLObjectType({
  name: "Recipe",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    ingredients: { type: GraphQLList(GraphQLString) },
    instructions: { type: GraphQLString },
    country: { type: GraphQLString },
    description: { type: GraphQLString },
    vote_average: { type: VoteAverageUnion },
    vote_count: { type: GraphQLInt },
    vote_bank: { type: VoteBankType },

    reviews: {
      type: GraphQLList(ReviewType),
      resolve: (parent) => {
        return Review.find({ recipeId: parent.id });
      },
    },
  }),
});

export const CountryType = new GraphQLObjectType({
  name: "Country",
  fields: () => ({
    id: { type: GraphQLID },
    country: { type: GraphQLString },
    description: { type: GraphQLString },
    recipes: {
      type: GraphQLList(RecipeType),
      resolve: (parent) => {
        return Recipe.find({ country: parent.country });
      },
    },
  }),
});

export const ReviewType = new GraphQLObjectType({
  name: "Review",
  fields: () => ({
    id: { type: GraphQLID },
    author: { type: GraphQLString },
    description: { type: GraphQLString },
    recipeId: { type: GraphQLString },
  }),
});

export const UserType = new GraphQLObjectType({
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
