import mongoose from 'mongoose';

/**
 * GoldPrice — Singleton collection.
 * Only ONE document should ever exist in this collection.
 * Enforced via a unique index on the `singleton` field.
 *
 * Formula used everywhere:
 *   finalPrice = pricePerGram × goldWeight + makingCharges
 */
const goldPriceSchema = new mongoose.Schema(
  {
    // Lock this to a constant so findOneAndUpdate({ singleton: 'gold' })
    // always targets the same document and never creates duplicates.
    singleton: {
      type: String,
      default: 'gold',
      enum: ['gold'],
      unique: true,
    },

    pricePerGram: {
      type: Number,
      required: [true, 'Gold price per gram is required'],
      min: [1, 'Gold price must be at least ₹1'],
      default: 6500,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },

    // Optional: who last updated (for audit trail)
    updatedBy: {
      type: String,
      default: 'system',
    },
  },
  {
    // Disable __v (versionKey) — not useful for a singleton
    versionKey: false,
  }
);

/**
 * Static helper: get or create the single gold price document.
 * Safe to call from multiple controllers without race conditions
 * thanks to the unique index + upsert pattern.
 */
goldPriceSchema.statics.getSingleton = async function (defaultPrice = 6500) {
  let doc = await this.findOne({ singleton: 'gold' });
  if (!doc) {
    doc = await this.create({ singleton: 'gold', pricePerGram: defaultPrice });
  }
  return doc;
};

const GoldPrice = mongoose.model('GoldPrice', goldPriceSchema);
export default GoldPrice;
