import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// ---------------------------------------------------------------------------
// Helper — generate a signed JWT valid for 7 days
// ---------------------------------------------------------------------------
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ---------------------------------------------------------------------------
// @route   POST /api/auth/register
// @desc    Register a new admin (restrict this route in production)
// @access  Public (should be disabled / protected after first admin is created)
// ---------------------------------------------------------------------------
export const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const exists = await Admin.findOne({ username: username.toLowerCase() });
    if (exists) {
      return res.status(409).json({ error: 'Admin with this username already exists' });
    }

    const admin = await Admin.create({ username, password });

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: { id: admin._id, username: admin.username, role: admin.role },
      token: generateToken(admin._id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// @route   POST /api/auth/login
// @desc    Authenticate admin and return JWT
// @access  Public
// ---------------------------------------------------------------------------
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      admin: { id: admin._id, username: admin.username, role: admin.role },
      token: generateToken(admin._id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------------------------------------------------------------
// @route   GET /api/auth/me
// @desc    Get the currently authenticated admin's profile
// @access  Private (requires valid JWT via protect middleware)
// ---------------------------------------------------------------------------
export const getMe = async (req, res) => {
  // req.admin is set by authMiddleware.js
  res.json({
    id: req.admin._id,
    username: req.admin.username,
    role: req.admin.role,
    createdAt: req.admin.createdAt,
  });
};
