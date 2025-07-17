import express from "express";
import Product from "../models/product.model";
import { authenticate, AuthRequest } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", async (req, res) => {
  const search = req.query.search?.toString() || "";
  const filter = search ? { name: { $regex: search, $options: "i" } } : {};

  try {
    const products = await Product.find(filter).populate(
      "owner",
      "firstName lastName"
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "owner",
      "firstName lastName"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to get product", error: err });
  }
});

router.post("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const newProduct = new Product({ ...req.body, owner: req.userId });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err });
  }
});

router.put("/:id", authenticate, async (req: AuthRequest, res) => {
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
});

router.delete("/:id", authenticate, async (req: AuthRequest, res) => {
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
});

export default router;
