// server/seed.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/user.model";
import Product from "./models/product.model";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/product-app";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    await Product.deleteMany();
    await User.deleteMany();

    const hashedPassword = await bcrypt.hash("test1234", 10);

    const user = new User({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: hashedPassword,
      birthDate: new Date("1990-01-01"),
    });

    await user.save();

    const sampleProducts = [
      {
        name: "Sample Product A",
        price: 100,
        discountPrice: 90,
        description: "A product with a discount",
        owner: user._id,
      },
      {
        name: "Sample Product B",
        price: 200,
        image: "https://via.placeholder.com/150",
        description: "Another product",
        owner: user._id,
      },
    ];

    await Product.insertMany(sampleProducts);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
