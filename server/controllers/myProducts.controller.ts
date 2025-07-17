import { Request, Response } from "express";
import Product from "../models/product.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getMyProducts = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "15");

    const total = await Product.countDocuments({ owner: req.userId });
    const totalPages = Math.ceil(total / limit);
    const products = await Product.find({ owner: req.userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("owner", "firstName lastName");

    res.json({ products, page, totalPages, total });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching your products", error: err });
  }
};
