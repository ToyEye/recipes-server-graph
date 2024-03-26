import mongoose from "mongoose";

import { app } from "./app.js";

const { MONGODB } = process.env;

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
