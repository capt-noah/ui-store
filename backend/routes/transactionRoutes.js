import express from 'express';
import { buyCredits } from '../controllers/transactionController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only logged-in users can buy credits
router.post('/', requireAuth, buyCredits);

export default router;
