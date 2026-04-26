import express from 'express';
import { createEnquiry, getEnquiries, deleteEnquiry, updateEnquiryStatus } from '../controllers/enquiryController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/enquiry        — public, customer contact form
router.post('/', createEnquiry);

// GET /api/enquiry         — protected, admin views all submissions
router.get('/', protect, getEnquiries);

// PATCH /api/enquiry/:id/status  — protected, admin updates status
router.patch('/:id/status', protect, updateEnquiryStatus);

// DELETE /api/enquiry/:id  — protected, admin deletes a submission
router.delete('/:id', protect, deleteEnquiry);

export default router;
