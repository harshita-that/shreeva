import mongoose from 'mongoose';

/**
 * Enquiry — Customer contact/enquiry form submissions.
 *
 * Public users submit enquiries from the contact page or product detail page.
 * Admin can view, update status, and delete them from the dashboard.
 */
const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },

    message: {
      type: String,
      trim: true,
      default: '',
    },

    // Optional — link enquiry to a specific product
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },

    // Admin workflow status
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
