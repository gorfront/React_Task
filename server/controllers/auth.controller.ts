import express, { Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { authenticate, AuthRequest } from "../middlewares/auth.middleware";

const router = express.Router();

const DEFAULT_AVATAR =
  "https://www.gomatch.nl/wp-content/uploads/2024/01/default-profielfoto-GOmatch.png";

function sanitizeUser(user: IUser) {
  const u = user.toObject();
  delete u.password;

  if (!u.avatar || typeof u.avatar !== "string" || u.avatar.trim() === "") {
    u.avatar = DEFAULT_AVATAR;
  }

  return u;
}

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthDate, avatar } =
      req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      birthDate,
      avatar: avatar,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, user: sanitizeUser(newUser) });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
});

router.put("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const updates = { ...req.body };
    if ("password" in updates) delete updates.password;

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed", error: err });
  }
});

router.get("/me", authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Failed to load user", error: err });
  }
});

export default router;
