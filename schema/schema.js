import graphql from "graphql";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
} = graphql;

import { Recipe, Country } from "../model/index.js";

const RecipeType = new GraphQLObjectType({
  name: "Recipe",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    ingredients: { type: GraphQLList(GraphQLString) },
    instructions: { type: GraphQLString },
    country: { type: GraphQLString },
  }),
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
      resolve: (parents, args) => {
        return Recipe.find({});
      },
    },
  },
});

export default new GraphQLSchema({ query: Query });
