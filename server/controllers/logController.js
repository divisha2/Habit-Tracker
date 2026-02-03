import Habit from '../models/Habit.js';
import Log from '../models/Log.js';
import { startOfDay, parseISO, format } from 'date-fns';

// @desc    Get all logs for user
// @route   GET /api/logs
// @access  Private
export const getAllLogs = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get all logs for this user (don't populate to avoid issues with deleted habits)
    const logs = await Log.find({ userId })
      .sort({ date: -1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle habit completion (One-Tap Check-in)
// @route   POST /api/logs/toggle
// @access  Private
export const toggleHabitCompletion = async (req, res, next) => {
  try {
    const { habitId, date } = req.body;
    const userId = req.user.id;
    
    // Use MongoDB
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    // Parse date or use today
    const targetDate = date ? parseISO(date) : new Date();
    
    // Find existing log or create new one
    const existingLog = await Log.findOne({
      habitId,
      userId,
      date: startOfDay(targetDate)
    });
    
    let log;
    if (existingLog) {
      // Toggle existing log
      existingLog.completed = !existingLog.completed;
      existingLog.completedAt = existingLog.completed ? new Date() : null;
      log = await existingLog.save();
    } else {
      // Create new log
      log = await Log.create({
        habitId,
        userId,
        date: startOfDay(targetDate),
        completed: true,
        completedAt: new Date()
      });
    }
    
    res.status(200).json({
      success: true,
      message: log.completed ? 'Habit completed! 🎉' : 'Habit unchecked',
      data: {
        log,
        habit: habit.name
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logs for a specific habit
// @route   GET /api/logs/habit/:habitId
// @access  Private
export const getHabitLogs = async (req, res, next) => {
  try {
    const { habitId } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;
    const userId = req.user.id;
    
    // Use MongoDB
    const query = { habitId, userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startOfDay(parseISO(startDate));
      if (endDate) query.date.$lte = startOfDay(parseISO(endDate));
    }
    
    const logs = await Log.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logs for a specific date
// @route   GET /api/logs/date/:date
// @access  Private
export const getLogsByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const userId = req.user.id;
    const targetDate = startOfDay(parseISO(date));
    
    // Use MongoDB
    const logs = await Log.find({ date: targetDate, userId })
      .populate('habitId', 'name category color')
      .sort({ completedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update logs (for calendar editing)
// @route   PUT /api/logs/bulk
// @access  Private
export const bulkUpdateLogs = async (req, res, next) => {
  try {
    const { updates } = req.body; // Array of { habitId, date, completed }
    const userId = req.user.id;
    
    const results = [];
    
    for (const update of updates) {
      try {
        let log;
        
        // Use MongoDB
        const targetDate = startOfDay(parseISO(update.date));
        
        const existingLog = await Log.findOne({
          habitId: update.habitId,
          userId,
          date: targetDate
        });
        
        if (existingLog) {
          existingLog.completed = update.completed;
          existingLog.completedAt = update.completed ? new Date() : null;
          log = await existingLog.save();
        } else if (update.completed) {
          log = await Log.create({
            habitId: update.habitId,
            userId,
            date: targetDate,
            completed: true,
            completedAt: new Date()
          });
        }
        
        results.push({ success: true, log });
      } catch (error) {
        results.push({ success: false, error: error.message, update });
      }
    }
    
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};