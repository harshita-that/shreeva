/**
 * Central error-handling middleware for Express.
 * Must be registered AFTER all routes in server.js.
 */

// ── 404 handler — catches any request that fell through all routes ─────────────
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// ── Global error handler ──────────────────────────────────────────────────────
export const errorHandler = (err, req, res, next) => {
  // Mongoose bad ObjectId  → treat as 404
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(404).json({
      success: false,
      error: 'Resource not found — invalid ID format',
    });
  }

  // Mongoose duplicate key (unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `Duplicate value: '${err.keyValue[field]}' already exists for field '${field}'`,
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      errors: messages,
    });
  }

  // Multer errors (file filter, size limit)
  if (err.name === 'MulterError' || err.message?.includes('Only image files')) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: 'Token expired' });
  }

  // Generic fallback
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
