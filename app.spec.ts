import { default as request } from "supertest";
import { makeApp } from "./app";
import nock from "nock";

const createProduct = jest.fn();
const getProductById = jest.fn();

const app = makeApp({ createProduct, getProductById });

const validProductData = {
  name: "Macbook Pro",
  description: "Reasonably priced laptop",
  price: 1800,
  currency: "USD",
};

const invalidProductData = {
  name: "Macbook Pro",
  description: "Reasonably priced laptop",
  currency: "USD",
};
describe("POST /product", () => {
  beforeAll(() => {
    nock("https://api.api-ninjas.com")
      .get("/v1/exchangerate?pair=USD_SEK")
      .times(2)
      .reply(200, { currency_pair: "USD_SEK", exchange_rate: 10 });
  });
  beforeEach(() => {
    createProduct.mockRestore();
    createProduct.mockResolvedValue({
      name: "Macbook Pro",
      description: "Reasonably priced laptop",
      price: 1800,
      currency: "USD",
    });

    getProductById.mockReset();
    getProductById.mockResolvedValue({
      name: "Macbook Pro",
      description: "Reasonably priced laptop",
      price: 1800,
      currency: "USD",
    });
  });

  it("should return status code 200 when posting product with valid data", async () => {
    const response = await request(app).post("/product").send(validProductData);
    expect(response.statusCode).toBe(200);
  });

  it("should return status code 400 when posting product with invalid data", async () => {
    const response = await request(app)
      .post("/product")
      .send(invalidProductData);
    expect(response.statusCode).toBe(400);
  });

  it("should call createProduct 1 time", async () => {
    const response = await request(app).post("/product").send(validProductData);
    expect(createProduct.mock.calls.length).toBe(1);
  });
});

describe("GET /product/:id", () => {
  it("should return status code 400 if invalid MongoDb id is provided", async () => {
    const response = await request(app).get("/product/fejkid");
    expect(response.statusCode).toBe(400);
  });
  it("should return a product when called with a correct Id", async () => {
    const response = await request(app).get(
      "/product/638dfd606c803c13707be651"
    );
    expect(response.body.name).toBe("Macbook Pro");
  });

  it("should return a prodcut with converted price in SEK", async () => {
    const response = await request(app).get(
      "/product/638dfd606c803c13707be651"
    );
    expect(response.body.priceInSEK).toBe(18000);
  });
});
