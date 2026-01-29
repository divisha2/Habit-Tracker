import express from 'express';
import {
  getHabits,
  createHabit,
  getHabit,
  updateHabit,
  deleteHabit
} from '../controllers/habitController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .get(getHabits)
  .post(createHabit);

router.route('/:id')
  .get(getHabit)
  .put(updateHabit)
  .delete(deleteHabit);

export default router;