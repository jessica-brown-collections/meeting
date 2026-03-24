import { Product } from './types';

export const PRODUCT_CATALOG: Product[] = [
  {
    id: 'prod-001',
    name: 'Wireless Noise-Cancelling Headphones',
    description:
      'Premium over-ear headphones with 30-hour battery life, active noise cancellation, and studio-quality sound.',
    price: 199.99,
    originalPrice: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    inStock: true,
    stockCount: 47,
    cartUrl: '#add-to-cart/prod-001',
    badge: 'Best Seller',
  },
  {
    id: 'prod-002',
    name: 'Minimalist Leather Watch',
    description:
      'Handcrafted genuine leather strap with Japanese quartz movement. Water-resistant up to 50m.',
    price: 149.0,
    originalPrice: 200.0,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'Accessories',
    inStock: true,
    stockCount: 12,
    cartUrl: '#add-to-cart/prod-002',
    badge: 'Limited',
  },
  {
    id: 'prod-003',
    name: 'Portable Bluetooth Speaker',
    description:
      '360° surround sound with IPX7 waterproof rating. 24-hour playtime with USB-C fast charging.',
    price: 79.99,
    originalPrice: 120.0,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    category: 'Electronics',
    inStock: true,
    stockCount: 85,
    cartUrl: '#add-to-cart/prod-003',
  },
  {
    id: 'prod-004',
    name: 'Organic Cotton Tote Bag',
    description: '100% organic cotton with reinforced handles. Holds up to 20kg. Machine washable.',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&h=400&fit=crop',
    category: 'Lifestyle',
    inStock: true,
    stockCount: 200,
    cartUrl: '#add-to-cart/prod-004',
  },
  {
    id: 'prod-005',
    name: 'Smart Fitness Tracker',
    description:
      'Tracks heart rate, sleep, steps, and 20+ sports modes. 7-day battery. Compatible with iOS & Android.',
    price: 89.99,
    originalPrice: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop',
    category: 'Electronics',
    inStock: true,
    stockCount: 33,
    cartUrl: '#add-to-cart/prod-005',
    badge: 'New',
  },
  {
    id: 'prod-006',
    name: 'Scented Soy Candle Set',
    description:
      'Set of 3 hand-poured soy candles with natural essential oils. Lavender, Vanilla & Eucalyptus.',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1602607523043-d8099d3cd5f4?w=400&h=400&fit=crop',
    category: 'Lifestyle',
    inStock: false,
    stockCount: 0,
    cartUrl: '#add-to-cart/prod-006',
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCT_CATALOG.find((p) => p.id === id);
}
