import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * POST /api/upload
 * Upload a single image. Returns the accessible URL.
 * Protected — only admins can upload standalone images.
 */
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  res.json({
    message: 'Image uploaded successfully',
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
  });
});

export default router;
