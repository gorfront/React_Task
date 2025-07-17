import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  discountPrice?: number;
  image?: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  image: { type: String },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IProduct>("Product", productSchema);
