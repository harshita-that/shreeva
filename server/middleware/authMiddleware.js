import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

/**
 * Protects admin routes by verifying the JWT sent as a Bearer token.
 * Attaches the authenticated admin document (without password) to req.admin.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');

    if (!req.admin) {
      return res.status(401).json({ error: 'Not authorized — admin not found' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authorized — token invalid or expired' });
  }
};

export default protect;
