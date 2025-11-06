import mongoose, { Schema } from 'mongoose';

export interface ProductDoc {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

const ProductSchema = new Schema<ProductDoc>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String },
});

export const ProductModel = mongoose.model<ProductDoc>('Product', ProductSchema);
