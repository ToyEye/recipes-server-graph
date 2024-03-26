import express from "express";
import cors from "cors";

import { graphqlHTTP } from "express-graphql";

import schema from "./schema/schema.js";

import "dotenv/config";

export const app = express();

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

app.use(cors());
