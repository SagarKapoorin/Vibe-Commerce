import { Product } from '../types.js';

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Mouse',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop&q=80',
    description: 'Ergonomic 2.4G wireless mouse',
  },
  {
    id: 'p2',
    name: 'Mechanical Keyboard',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1602025882379-e01cf08baa51?w=500&h=500&fit=crop&q=80',
    description: 'Blue switches, RGB backlight',
  },
  { 
    id: 'p3', 
    name: 'USB-C Hub', 
    price: 24.99, 
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop&q=80', 
    description: '7-in-1 multiport adapter' 
  },
  {
    id: 'p4',
    name: 'Noise-Cancel Headphones',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&q=80',
    description: 'Over-ear ANC headphones',
  },
  { 
    id: 'p5', 
    name: '1080p Webcam', 
    price: 34.99, 
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop&q=80', 
    description: 'Full HD USB webcam' 
  },
  {
    id: 'p6',
    name: 'Portable SSD 1TB',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop&q=80',
    description: 'USB 3.2 high-speed drive',
  },
  {
    id: 'p7',
    name: 'Laptop Stand',
    price: 27.5,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop&q=80',
    description: 'Adjustable aluminum stand',
  },
  { 
    id: 'p8', 
    name: 'Desk Lamp', 
    price: 22.0, 
    image: 'https://images.unsplash.com/photo-1621447980929-6638614633c8?w=500&h=500&fit=crop&q=80', 
    description: 'LED lamp with dimmer' 
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
