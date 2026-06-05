import express from 'express';
import {
  getComponents,
  getComponentById,
  createComponent,
  approveComponent,
  getPendingComponents,
  deleteComponent,
  updateComponent,
} from '../controllers/componentController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: get all approved components
router.get('/', getComponents);

// Admin only: pending queue — MUST be before /:id to avoid "pending" being treated as an ID
router.get('/pending', requireAdmin, getPendingComponents);

// Public: get single component details
router.get('/:id', getComponentById);

// Private: logged-in users can submit components
router.post('/', requireAuth, createComponent);

// Admin only: approve, delete, update
router.put('/:id/approve', requireAdmin, approveComponent);
router.delete('/:id', requireAdmin, deleteComponent);
router.put('/:id', requireAdmin, updateComponent);

export default router;
