import mongoose, { Schema } from "mongoose";

export interface CartItemDoc {
  productId: string; // references Product._id (string)
  qty: number;
}

export interface CartDoc {
  userId: string;
  items: CartItemDoc[];
  updatedAt: Date;
}

const CartItemSchema = new Schema<CartItemDoc>({
  productId: { type: String, required: true, index: true },
  qty: { type: Number, required: true, min: 1 },
});

const CartSchema = new Schema<CartDoc>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    items: { type: [CartItemSchema], default: [] },
    updatedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: { createdAt: false, updatedAt: "updatedAt" } }
);

export const CartModel = mongoose.model<CartDoc>("Cart", CartSchema);

