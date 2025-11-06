import { Product } from '../types.js';

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Mouse',
    price: 19.99,
    image: '',
    description: 'Ergonomic 2.4G wireless mouse',
  },
  {
    id: 'p2',
    name: 'Mechanical Keyboard',
    price: 49.99,
    image: '',
    description: 'Blue switches, RGB backlight',
  },
  { id: 'p3', name: 'USB-C Hub', price: 24.99, image: '', description: '7-in-1 multiport adapter' },
  {
    id: 'p4',
    name: 'Noise-Cancel Headphones',
    price: 89.99,
    image: '',
    description: 'Over-ear ANC headphones',
  },
  { id: 'p5', name: '1080p Webcam', price: 34.99, image: '', description: 'Full HD USB webcam' },
  {
    id: 'p6',
    name: 'Portable SSD 1TB',
    price: 119.99,
    image: '',
    description: 'USB 3.2 high-speed drive',
  },
  {
    id: 'p7',
    name: 'Laptop Stand',
    price: 27.5,
    image: '',
    description: 'Adjustable aluminum stand',
  },
  { id: 'p8', name: 'Desk Lamp', price: 22.0, image: '', description: 'LED lamp with dimmer' },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
