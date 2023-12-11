import express, { json } from "express";
import { ProductType, isValidId } from "./database";
import { convertCurrencyFromUSDToSEK } from "./currency";

type AppProps = {
  createProduct: (productData: ProductType) => any;
  getProductById: (id: string) => any;
};

export const makeApp = ({ createProduct, getProductById }: AppProps) => {
  const app = express();

  app.use(json());
  app.post("/product", async (req, res) => {
    const errors = [];
    if (!req.body.name || req.body.name.length === 0) {
      errors.push({ error: "You must provide a name" });
    }
    if (!req.body.description || req.body.description.length === 0) {
      errors.push({ error: "You must provide a description" });
    }

    if (!req.body.price || isNaN(+req.body.price)) {
      errors.push({ error: "You must provide a price, must be a number" });
    }

    if (!req.body.currency || req.body.currency.length !== 3) {
      errors.push({ error: "You must provide a currency, must be 3 letters" });
    }
    if (errors.length) {
      res.status(400).json(errors);
    } else {
      const product = await createProduct(req.body);

      res.json(product);
    }
  });

  app.get("/product/:id", async (req, res) => {
    if (!isValidId(req.params.id)) {
      res.status(400).send();
    } else {
      const product = await getProductById(req.params.id);
      const priceInSEK = await convertCurrencyFromUSDToSEK(product.price);
      res.json({ ...product, priceInSEK });
    }
  });
  return app;
};
