import express from 'express';
import { registerAdmin, loginAdmin, getMe } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register  — create first admin (disable after initial setup)
router.post('/register', registerAdmin);

// POST /api/auth/login  — returns JWT on success
router.post('/login', loginAdmin);

// GET  /api/auth/me  — returns authenticated admin profile (protected)
router.get('/me', protect, getMe);

export default router;
