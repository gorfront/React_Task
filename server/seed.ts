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
    console.log("✅ Using in-memory MongoDB");
  } else {
    mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/product-app";
    console.log("✅ Using real MongoDB");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Очистка коллекций
    await Product.deleteMany();
    await User.deleteMany();

    // Создаем тестового пользователя
    const user = new User({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "hashed_password_here", // замени на реальный хеш
    });
    await user.save();

    // Добавляем продукты с owner = user._id
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

    console.log("🌱 Seeded database");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
    console.log("🔌 Disconnected");
  }
}

seed();
