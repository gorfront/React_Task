import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate?: Date;
  avatar?: string;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthDate: { type: Date },
  avatar: {
    type: String,
    default:
      "https://www.gomatch.nl/wp-content/uploads/2024/01/default-profielfoto-GOmatch.png",
  },
});

export default mongoose.model<IUser>("User", userSchema);
