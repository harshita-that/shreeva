import express from 'express';
import { getGoldPrice, updateGoldPrice } from '../controllers/goldPriceController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * GET /api/gold-price
 * Public — frontend uses this to display live price and calculate dynamic product pricing.
 */
router.get('/', getGoldPrice);

/**
 * PUT  /api/gold-price  — full replace (standard REST)
 * PATCH /api/gold-price — partial update alias (same handler, both accepted)
 * Both are protected — require admin JWT.
 */
router.put('/',   protect, updateGoldPrice);
router.patch('/', protect, updateGoldPrice);

export default router;
