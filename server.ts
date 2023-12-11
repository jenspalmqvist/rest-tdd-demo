import mongoose from "mongoose";
import { makeApp } from "./app";
import { createProduct, getProductById } from "./database";

const port = 8081;
const app = makeApp({ createProduct, getProductById });

export const server = {};

mongoose.connect("connectionstring").then(() => {
  app.listen(port, () => {
    console.log(`Listening to port ${port}`);
  });
});
