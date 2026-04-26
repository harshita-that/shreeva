import Product from '../models/Product.js';
import GoldPrice from '../models/GoldPrice.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Fetches the singleton gold price document.
 * Uses the static getSingleton() helper which auto-seeds ₹6500/g if missing.
 * Product finalPrice = pricePerGram × goldWeight + makingCharges
 */
const getCurrentGoldPrice = async () => {
  return await GoldPrice.getSingleton();
};

/**
 * Attaches dynamic pricing fields to a plain product object.
 * finalPrice = goldPrice × goldWeight + makingCharges
 *
 * @param {Object} productObj  — plain JS object (product.toObject())
 * @param {Number} pricePerGram — current live gold price per gram
 */
const attachPricing = (productObj, pricePerGram) => {
  const goldValue  = Math.round(pricePerGram * productObj.goldWeight);
  const finalPrice = goldValue + productObj.makingCharges;

  return {
    ...productObj,
    finalPrice,          // ← computed dynamically, never stored in DB
    priceBreakdown: {
      goldPricePerGram: pricePerGram,
      goldWeight:       productObj.goldWeight,
      goldValue,
      makingCharges:    productObj.makingCharges,
      finalPrice,
    },
  };
};

/**
 * Validates required and numeric fields on create/update.
 * Returns an array of error strings (empty = valid).
 */
const validateProductInput = (body, isCreate = false) => {
  const errors = [];

  if (isCreate && !body.name?.trim()) errors.push('Product name is required');
  if (isCreate && !body.category?.trim()) errors.push('Category is required');

  if (body.goldWeight !== undefined) {
    const w = Number(body.goldWeight);
    if (isNaN(w) || w <= 0) errors.push('goldWeight must be a positive number');
  } else if (isCreate) {
    errors.push('goldWeight is required');
  }

  if (body.makingCharges !== undefined) {
    const mc = Number(body.makingCharges);
    if (isNaN(mc) || mc < 0) errors.push('makingCharges must be a non-negative number');
  } else if (isCreate) {
    errors.push('makingCharges is required');
  }

  return errors;
};

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * @route   GET /api/products
 * @desc    Get all ACTIVE products with dynamic pricing
 * @access  Public
 */
export const getProducts = async (req, res, next) => {
  try {
    const goldPrice = await getCurrentGoldPrice();

    // Support optional ?category= filter
    const filter = { isActive: true };
    if (req.query.category) {
      filter.category = req.query.category.toLowerCase();
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    const result = products.map((p) =>
      attachPricing(p.toObject(), goldPrice.pricePerGram)
    );

    res.json({
      success: true,
      count: result.length,
      goldPricePerGram: goldPrice.pricePerGram,
      goldPriceLastUpdated: goldPrice.lastUpdated,
      products: result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product with dynamic pricing
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const goldPrice = await getCurrentGoldPrice();

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const result = attachPricing(product.toObject(), goldPrice.pricePerGram);
    result.goldPriceLastUpdated = goldPrice.lastUpdated;
    result.success = true;

    res.json(result);
  } catch (err) {
    next(err); // CastError (bad ObjectId) handled by errorMiddleware → 404
  }
};

/**
 * @route   POST /api/products
 * @desc    Create a new product (with optional image upload via multer)
 * @access  Private (admin)
 */
export const createProduct = async (req, res) => {
  try {
    const errors = validateProductInput(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Build images array — from multer (req.files) or JSON body (req.body.images)
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((f) => `/uploads/${f.filename}`);
    } else if (req.body.images) {
      // Accept images passed as JSON array or comma-separated string
      images = Array.isArray(req.body.images)
        ? req.body.images
        : req.body.images.split(',').map((s) => s.trim());
    }

    // Snapshot current gold price for reference (never used in final price calc)
    const goldPrice = await getCurrentGoldPrice();

    const product = await Product.create({
      name: req.body.name.trim(),
      description: req.body.description || '',
      category: req.body.category.trim().toLowerCase(),
      goldWeight: Number(req.body.goldWeight),
      makingCharges: Number(req.body.makingCharges),
      goldPriceAtCreation: goldPrice.pricePerGram,
      images,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    });

    const result = attachPricing(product.toObject(), goldPrice.pricePerGram);

    res.status(201).json({
      message: 'Product created successfully',
      product: result,
    });
  } catch (err) {
    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product (partial update supported)
 * @access  Private (admin)
 */
export const updateProduct = async (req, res) => {
  try {
    const errors = validateProductInput(req.body, false);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Build update payload (only include provided fields)
    const updates = {};
    if (req.body.name) updates.name = req.body.name.trim();
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.category) updates.category = req.body.category.trim().toLowerCase();
    if (req.body.goldWeight !== undefined) updates.goldWeight = Number(req.body.goldWeight);
    if (req.body.makingCharges !== undefined) updates.makingCharges = Number(req.body.makingCharges);
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;

    // Handle image updates — new uploads append (or replace if ?replace=true)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => `/uploads/${f.filename}`);
      updates.images =
        req.query.replace === 'true' ? newImages : [...existing.images, ...newImages];
    } else if (req.body.images !== undefined) {
      updates.images = Array.isArray(req.body.images)
        ? req.body.images
        : req.body.images.split(',').map((s) => s.trim());
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    const goldPrice = await getCurrentGoldPrice();
    const result = attachPricing(product.toObject(), goldPrice.pricePerGram);

    res.json({
      message: 'Product updated successfully',
      product: result,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Soft-delete by setting isActive=false, or hard delete with ?permanent=true
 * @access  Private (admin)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (req.query.permanent === 'true') {
      await Product.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Product permanently deleted' });
    }

    // Default: soft delete
    product.isActive = false;
    await product.save();

    res.json({ message: 'Product deactivated (soft delete)', productId: product._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
