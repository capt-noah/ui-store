import express from 'express';
import { purchaseComponent, getMyPurchases, removeFromLibrary } from '../controllers/purchaseController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, purchaseComponent);
router.get('/me', requireAuth, getMyPurchases);
router.delete('/:componentId', requireAuth, removeFromLibrary);

export default router;
