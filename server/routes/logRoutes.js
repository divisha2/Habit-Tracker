import express from 'express';
import {
  toggleHabitCompletion,
  getHabitLogs,
  getLogsByDate,
  bulkUpdateLogs
} from '../controllers/logController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// One-tap check-in route (most important!)
router.post('/toggle', toggleHabitCompletion);

// Bulk operations
router.put('/bulk', bulkUpdateLogs);

// Query routes
router.get('/habit/:habitId', getHabitLogs);
router.get('/date/:date', getLogsByDate);

export default router;