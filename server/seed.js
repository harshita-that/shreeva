/**
 * seed.js — Seed script for Shreeva Jewellers
 *
 * Usage:
 *   npm run seed          ← insert only if DB is empty
 *   npm run seed:fresh    ← wipe products + re-seed (destructive!)
 *
 * Run from: server/ directory
 */

import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import GoldPrice from './models/GoldPrice.js';

dotenv.config();
await connectDB();

// ── Gold price seed — uses singleton pattern ─────────────────────────────────
// findOneAndUpdate with upsert ensures only ONE record ever exists
let goldPrice = await GoldPrice.findOneAndUpdate(
  { singleton: 'gold' },
  { $setOnInsert: { singleton: 'gold', pricePerGram: 7200, lastUpdated: new Date() } },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

if (goldPrice.pricePerGram === 7200 && !goldPrice.updatedBy) {
  console.log('✅ Gold price seeded: ₹7200/g');
} else {
  console.log(`ℹ️  Gold price already set: ₹${goldPrice.pricePerGram}/g`);
}

// ── Product seeds (uses new schema field names) ───────────────────────────────
const seedProducts = [
  {
    name: 'Royal Gold Ring',
    description: 'Elegant 22K gold ring with intricate craftsmanship. Perfect for weddings and special occasions.',
    category: 'rings',
    goldWeight: 5.2,
    makingCharges: 3500,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a44ca?w=400&h=500&fit=crop',
    ],
    isActive: true,
    goldPriceAtCreation: goldPrice.pricePerGram,
  },
  {
    name: 'Eternal Necklace',
    description: 'Timeless necklace for every occasion. Handcrafted with pure 22K gold.',
    category: 'necklaces',
    goldWeight: 12.5,
    makingCharges: 8500,
    images: [
      'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1515562149417-8b8c2b0c5b3c?w=400&h=500&fit=crop',
    ],
    isActive: true,
    goldPriceAtCreation: goldPrice.pricePerGram,
  },
  {
    name: 'Dewdrop Earrings',
    description: 'Delicate dewdrop-shaped gold earrings. Lightweight and elegant for daily wear.',
    category: 'earrings',
    goldWeight: 3.8,
    makingCharges: 2200,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9abac038?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1617038224557-69d61629fd8e?w=400&h=500&fit=crop',
    ],
    isActive: true,
    goldPriceAtCreation: goldPrice.pricePerGram,
  },
  {
    name: 'Classic Bracelet',
    description: 'Sleek gold bracelet with a modern minimalist touch. Ideal for gifting.',
    category: 'bracelets',
    goldWeight: 8.0,
    makingCharges: 4800,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220e?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe261cdc?w=400&h=500&fit=crop',
    ],
    isActive: true,
    goldPriceAtCreation: goldPrice.pricePerGram,
  },
  {
    name: 'Mystic Pendant',
    description: 'Enchanting pendant with a mystical circular design. Pairs beautifully with any chain.',
    category: 'pendants',
    goldWeight: 4.5,
    makingCharges: 3000,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba420552259?w=400&h=500&fit=crop',
    ],
    isActive: true,
    goldPriceAtCreation: goldPrice.pricePerGram,
  },
  {
    name: 'Wedding Band',
    description: 'Classic wedding band crafted for your most special day. Available in custom sizes.',
    category: 'rings',
    goldWeight: 6.0,
    makingCharges: 4000,
    images: [
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=400&h=500&fit=crop',
    ],
    isActive: true,
    goldPriceAtCreation: goldPrice.pricePerGram,
  },
  {
    name: 'Temple Bangle Set',
    description: 'Traditional temple-style bangle set. Inspired by South Indian craftsmanship.',
    category: 'bangles',
    goldWeight: 18.0,
    makingCharges: 12000,
    images: [
      'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=400&h=500&fit=crop',
    ],
    isActive: true,
    goldPriceAtCreation: goldPrice.pricePerGram,
  },
  {
    name: 'Slender Gold Chain',
    description: 'Lightweight 18-inch gold chain. Perfect as a standalone piece or with a pendant.',
    category: 'chains',
    goldWeight: 5.5,
    makingCharges: 2800,
    images: [
      'https://images.unsplash.com/photo-1515562149417-8b8c2b0c5b3c?w=400&h=500&fit=crop',
    ],
    isActive: true,
    goldPriceAtCreation: goldPrice.pricePerGram,
  },
];

// ── Decide: fresh seed or incremental ────────────────────────────────────────
const freshMode = process.argv.includes('--fresh');

if (freshMode) {
  await Product.deleteMany({});
  console.log('🗑️  Cleared all existing products');
}

const existing = await Product.countDocuments();

if (existing === 0 || freshMode) {
  await Product.insertMany(seedProducts);
  console.log(`✅ Seeded ${seedProducts.length} products successfully`);
} else {
  // Incremental: upsert by name
  for (const sp of seedProducts) {
    await Product.updateOne({ name: sp.name }, { $set: sp }, { upsert: true });
  }
  console.log(`🔄 Upserted ${seedProducts.length} products (incremental mode)`);
}

console.log(`\n📦 Total products in DB: ${await Product.countDocuments()}`);
console.log('💰 Gold price for pricing: ₹' + goldPrice.pricePerGram + '/g');
console.log('\nSample finalPrice calculation:');
const sample = seedProducts[0];
const fp = Math.round(goldPrice.pricePerGram * sample.goldWeight + sample.makingCharges);
console.log(`  ${sample.name}: ₹${goldPrice.pricePerGram} × ${sample.goldWeight}g + ₹${sample.makingCharges} = ₹${fp}`);


process.exit(0);
