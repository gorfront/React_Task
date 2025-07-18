import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from "dotenv";
import Product from "./models/product.model";
import User from "./models/user.model";

dotenv.config();

async function seed() {
  const useMemory = process.env.USE_MEMORY_DB === "true";

  let mongod: MongoMemoryServer | null = null;
  let mongoUri: string;

  if (useMemory) {
    mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
  } else {
    mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/product-app";
  }

  try {
    await mongoose.connect(mongoUri);
    await Product.deleteMany();
    await User.deleteMany();

    const user = new User({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "hashed_password_here",
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
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        description: "Another product",
        owner: user._id,
      },
    ];
    await Product.insertMany(sampleProducts);
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  }
}

seed();
