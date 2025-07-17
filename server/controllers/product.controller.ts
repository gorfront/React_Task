import { Request, Response } from "express";
import Product from "../models/product.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await Product.find().populate("owner", "firstName lastName");
  res.json(products);
};

export const getMyProducts = async (req: AuthRequest, res: Response) => {
  const products = await Product.find({ owner: req.userId });
  res.json(products);
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const newProduct = new Product({ ...req.body, owner: req.userId });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.userId,
    });
    if (!product)
      return res.status(404).json({ message: "Not found or unauthorized" });

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const result = await Product.deleteOne({
      _id: req.params.id,
      owner: req.userId,
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Not found or unauthorized" });

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err });
  }
};
