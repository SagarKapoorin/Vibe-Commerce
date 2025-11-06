import mongoose from 'mongoose';
import { products as seedProducts } from '../data/products.js';
import { ProductModel } from '../models/Product.js';
let isConnected = false;
export async function connectDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }
  await mongoose.connect(uri);
  isConnected = true;
  //seed products if empty
  const count = await ProductModel.estimatedDocumentCount();
  if (count === 0) {
    await ProductModel.insertMany(
      seedProducts.map((p) => ({
        _id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        description: p.description,
      })),
    );
    // console.log("hiting seed")
     
    console.log(`Seeded ${seedProducts.length} products`);
  }
}
