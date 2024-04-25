import express from "express";
import cors from "cors";

import { User } from "./model/userModel.js";

import { graphqlHTTP } from "express-graphql";

import schema from "./schema/schema.js";

import "dotenv/config";
import { authenticate } from "./middlewares/authenticate.js";

export const app = express();

app.use(
  "/graphql",
  authenticate,
  graphqlHTTP((req, res) => {
    return { schema, graphiql: true, context: req };
  })
);

app.use(cors());
