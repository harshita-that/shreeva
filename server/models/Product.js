import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // ── Core fields ────────────────────────────────────────────────────────
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      lowercase: true,
      enum: {
        values: ['rings', 'necklaces', 'earrings', 'bracelets', 'bangles', 'pendants', 'chains', 'other'],
        message: '{VALUE} is not a valid category',
      },
    },

    // ── Pricing inputs (final price is computed, NOT stored) ───────────────
    goldWeight: {
      type: Number,
      required: [true, 'Gold weight (in grams) is required'],
      min: [0.01, 'Gold weight must be greater than 0'],
    },

    makingCharges: {
      type: Number,
      required: [true, 'Making charges are required'],
      min: [0, 'Making charges cannot be negative'],
    },

    // Optional: snapshot of gold price at the time of product creation
    goldPriceAtCreation: {
      type: Number,
      default: null,
    },

    // ── Images (array of relative URL paths like /uploads/shreeva-xxx.jpg) ─
    images: {
      type: [String],
      default: [],
    },

    // ── Visibility toggle ─────────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ── Virtual: finalPrice (computed, never stored in DB) ─────────────────────
// Usage: product.toObject({ virtuals: true }) or product.toJSON({ virtuals: true })
productSchema.virtual('finalPrice').get(function () {
  if (!this._currentGoldPrice) return null;
  return Math.round(this._currentGoldPrice * this.goldWeight + this.makingCharges);
});

const Product = mongoose.model('Product', productSchema);
export default Product;
