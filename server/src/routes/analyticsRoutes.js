import express from 'express';
import {
  getAnalyticsOverview,
  getWeeklyThroughput,
  getPriorityDistribution,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All analytics routes are protected
router.use(protect);

router.get('/overview', getAnalyticsOverview);
router.get('/weekly', getWeeklyThroughput);
router.get('/priority', getPriorityDistribution);

export default router;
