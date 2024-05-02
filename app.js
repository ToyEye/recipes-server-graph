import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import "dotenv/config";
const { MONGODB } = process.env;

import { graphqlHTTP } from "express-graphql";

import schema from "./schema/schema.js";

import "dotenv/config";
import { authenticate } from "./middlewares/authenticate.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/graphql",
  authenticate,
  graphqlHTTP((req, res) => {
    return { schema, graphiql: true, context: req };
  })
);

mongoose
  .connect(MONGODB)
  .then(() => {
    console.log("Mongo on");
    app.listen(3001, () => {
      console.log("server on");
    });
  })
  .catch(() => {
    process.exit(1);
  });
