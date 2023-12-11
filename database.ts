import mongoose, { mongo } from "mongoose";

export type ProductType = {
  name: string;
  description: string;
  price: number;
  currency: "USD" | "SEK";
};

const productSchema = new mongoose.Schema<ProductType>({
  name: String,
  description: String,
  price: Number,
  currency: String,
});

const ProductModel = mongoose.model("product", productSchema);

export const createProduct = async (productData: ProductType) => {
  return await new ProductModel(productData).save();
};

export const getProductById = async (id: string) => {
  return await ProductModel.findById(id);
};
export const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);
