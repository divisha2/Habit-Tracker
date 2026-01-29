import express from 'express';
import {
  getDashboardStats,
  getHabitAnalytics,
  getOverviewStats
} from '../controllers/statsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Dashboard stats for Recharts visualization
router.get('/dashboard', getDashboardStats);

// Individual habit analytics
router.get('/habit/:habitId', getHabitAnalytics);

// Overview statistics
router.get('/overview', getOverviewStats);

export default router;