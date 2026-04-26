// ── Load env FIRST — before any other imports use process.env ────────────────
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import goldPriceRoutes from './routes/goldPriceRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// ── Debug: confirm env loaded correctly ──────────────────────────────────────
console.log('🔑 MONGO_URI loaded:', process.env.MONGO_URI ? '✅ (Atlas URI present)' : '❌ MISSING');

// ── __dirname shim for ESM ───────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── App setup ────────────────────────────────────────────────────────────────
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  /\.vercel\.app$/,          // any Vercel preview/prod URL
  process.env.CLIENT_URL,   // set this in Railway env to your exact Vercel URL
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)          // Postman / server-to-server
    const ok = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    )
    ok ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static — serve uploaded images ──────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '🪙 Shreeva Jewellers API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── API routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/admin',      authRoutes);   // alias: /api/admin/login, /api/admin/me
app.use('/api/products',   productRoutes);
app.use('/api/gold-price', goldPriceRoutes);
app.use('/api/enquiry',    enquiryRoutes);
app.use('/api/upload',     uploadRoutes);

// ── Error handling (must be after all routes) ────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Shreeva Jewellers server running on port ${PORT}`);
    console.log(`   Health check → http://localhost:${PORT}/`);
    console.log(`   Environment  → ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
