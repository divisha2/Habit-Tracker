import Habit from '../models/Habit.js';
import Log from '../models/Log.js';
import { startOfDay, subDays } from 'date-fns';

// @desc    Get all habits with today's completion status
// @route   GET /api/habits
// @access  Private
export const getHabits = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = startOfDay(new Date());
    
    // Get all active habits for this user
    const habits = await Habit.find({ userId, isActive: true }).sort({ createdAt: -1 });
    
    // Get today's logs for all habits
    const todayLogs = await Log.find({
      userId,
      date: today,
      habitId: { $in: habits.map(h => h._id) }
    });
    
    // Create a map for quick lookup
    const logMap = new Map(todayLogs.map(log => [log.habitId.toString(), log]));
    
    // Enhance habits with today's completion status
    const habitsWithStatus = habits.map(habit => ({
      ...habit.toObject(),
      completedToday: logMap.has(habit._id.toString()) ? logMap.get(habit._id.toString()).completed : false,
      todayLog: logMap.get(habit._id.toString()) || null
    }));

    res.status(200).json({
      success: true,
      count: habitsWithStatus.length,
      data: habitsWithStatus
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
export const createHabit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const habitData = { ...req.body, userId };
    
    const habit = await Habit.create(habitData);
    
    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single habit with streak data
// @route   GET /api/habits/:id
// @access  Private
export const getHabit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const habit = await Habit.findOne({ _id: req.params.id, userId });
    
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    // Calculate streak data (simplified for now)
    const streakData = { currentStreak: 5, longestStreak: 12 };
    
    // Get recent logs (last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30);
    const recentLogs = await Log.find({
      habitId: habit._id,
      userId,
      date: { $gte: startOfDay(thirtyDaysAgo) }
    }).sort({ date: -1 });

    const habitWithData = {
      ...habit.toObject(),
      ...streakData,
      recentLogs
    };

    res.status(200).json({
      success: true,
      data: habitWithData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
export const updateHabit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Habit updated successfully',
      data: habit
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete habit (soft delete)
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId },
      { isActive: false },
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Habit deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};