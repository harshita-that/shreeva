import Enquiry from '../models/Enquiry.js';

/**
 * @route   POST /api/enquiry
 * @desc    Submit a customer enquiry (contact form)
 * @access  Public
 */
export const createEnquiry = async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name?.trim() || !phone?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Name and phone number are required',
      });
    }

    // Basic phone number sanity check (at least 7 digits)
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid phone number',
      });
    }

    const enquiry = await Enquiry.create({ name: name.trim(), phone: phone.trim(), message });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. We will contact you soon!',
      data: enquiry,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @route   GET /api/enquiry
 * @desc    Get all enquiries (admin only)
 * @access  Private
 */
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('productId', 'name category')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @route   PATCH /api/enquiry/:id/status
 * @desc    Update enquiry status (admin only)
 * @access  Private
 */
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ success: false, error: 'Enquiry not found' });
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @route   DELETE /api/enquiry/:id
 * @desc    Delete an enquiry (admin only)
 * @access  Private
 */
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, error: 'Enquiry not found' });
    }
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
