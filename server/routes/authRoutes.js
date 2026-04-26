import express from 'express';
import { registerAdmin, loginAdmin, getMe } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register  — disabled in production after first admin created
router.post('/register', (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Registration is disabled in production' });
  }
  next();
}, registerAdmin);

// POST /api/auth/login  — returns JWT on success
router.post('/login', loginAdmin);

// GET  /api/auth/me  — returns authenticated admin profile (protected)
router.get('/me', protect, getMe);

export default router;
