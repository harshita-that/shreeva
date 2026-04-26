import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────────

// GET /api/products           — list all active products (supports ?category= filter)
router.get('/', getProducts);

// GET /api/products/:id       — single product with dynamic pricing
router.get('/:id', getProductById);

// ── Protected (admin) routes ─────────────────────────────────────────────────

// POST /api/products          — create product, up to 5 images via multipart
router.post('/', protect, upload.array('images', 5), createProduct);

// PUT /api/products/:id       — partial update; add ?replace=true to replace images
router.put('/:id', protect, upload.array('images', 5), updateProduct);

// DELETE /api/products/:id    — soft delete by default; add ?permanent=true for hard delete
router.delete('/:id', protect, deleteProduct);

export default router;
