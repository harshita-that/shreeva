import GoldPrice from '../models/GoldPrice.js';

// ── Shared response shape ────────────────────────────────────────────────────
const formatResponse = (doc) => ({
  pricePerGram: doc.pricePerGram,
  lastUpdated:  doc.lastUpdated,
  updatedBy:    doc.updatedBy,
});

// ── Validate price input ─────────────────────────────────────────────────────
const parsePrice = (body) => {
  // Accept both camelCase and snake_case from admin panel / Postman
  const raw = body.pricePerGram ?? body.price_per_gram;
  const price = Number(raw);
  return price;
};

/**
 * @route   GET /api/gold-price
 * @desc    Get the current live gold price per gram.
 *          Auto-seeds ₹6500/g if no document exists yet.
 * @access  Public
 */
export const getGoldPrice = async (req, res, next) => {
  try {
    const goldPrice = await GoldPrice.getSingleton();

    res.json({
      success: true,
      data: formatResponse(goldPrice),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   PUT /api/gold-price  (also PATCH)
 * @desc    Update the live gold price per gram.
 *          Uses findOneAndUpdate with upsert to guarantee singleton behaviour.
 * @access  Private — requires valid JWT (protect middleware)
 * @body    { pricePerGram: Number }  OR  { price_per_gram: Number }
 */
export const updateGoldPrice = async (req, res, next) => {
  try {
    const pricePerGram = parsePrice(req.body);

    // ── Validation ────────────────────────────────────────────────────────
    if (isNaN(pricePerGram) || pricePerGram <= 0) {
      return res.status(400).json({
        success: false,
        error: 'pricePerGram must be a positive number (e.g. 7200)',
      });
    }

    if (pricePerGram > 200000) {
      return res.status(400).json({
        success: false,
        error: 'pricePerGram seems unrealistically high. Please verify the value.',
      });
    }

    // ── Upsert — always targets the singleton document ─────────────────────
    const updatedBy = req.admin?.username || 'admin';

    const goldPrice = await GoldPrice.findOneAndUpdate(
      { singleton: 'gold' },
      {
        $set: {
          pricePerGram,
          lastUpdated: new Date(),
          updatedBy,
        },
      },
      {
        new: true,          // return updated doc
        upsert: true,       // create if it doesn't exist
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({
      success: true,
      message: `Gold price updated to ₹${pricePerGram}/g by ${updatedBy}`,
      data: formatResponse(goldPrice),
    });
  } catch (err) {
    next(err);
  }
};
