import Habit from '../models/Habit.js';
import Log from '../models/Log.js';
import memoryDB from '../utils/memoryDB.js';
import { startOfDay, subDays } from 'date-fns';

// Check if MongoDB is connected
const isMongoConnected = () => {
  return process.env.MONGODB_CONNECTED === 'true';
};

// @desc    Get all habits with today's completion status
// @route   GET /api/habits
// @access  Private
export const getHabits = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let habits = [];
    
    if (isMongoConnected()) {
      // Use MongoDB
      const today = startOfDay(new Date());
      
      // Get all active habits for this user
      habits = await Habit.find({ userId, isActive: true }).sort({ createdAt: -1 });
      
      // Get today's logs for all habits
      const todayLogs = await Log.find({
        userId,
        date: today,
        habitId: { $in: habits.map(h => h._id) }
      });
      
      // Create a map for quick lookup
      const logMap = new Map(todayLogs.map(log => [log.habitId.toString(), log]));
      
      // Enhance habits with today's completion status
      habits = habits.map(habit => ({
        ...habit.toObject(),
        completedToday: logMap.has(habit._id.toString()) ? logMap.get(habit._id.toString()).completed : false,
        todayLog: logMap.get(habit._id.toString()) || null
      }));
    } else {
      // Use memory database
      habits = memoryDB.findHabitsByUserId(userId);
      
      // Add completion status (mock for now)
      habits = habits.map(habit => ({
        ...habit,
        completedToday: Math.random() > 0.5, // Random completion for demo
        currentStreak: Math.floor(Math.random() * 10) + 1
      }));
    }

    res.status(200).json({
      success: true,
      count: habits.length,
      data: habits
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
    
    let habit;
    
    if (isMongoConnected()) {
      // Use MongoDB
      habit = await Habit.create(habitData);
    } else {
      // Use memory database
      habit = memoryDB.createHabit(habitData);
    }
    
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
    let habit;
    
    if (isMongoConnected()) {
      // Use MongoDB
      habit = await Habit.findOne({ _id: req.params.id, userId });
      
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

      habit = {
        ...habit.toObject(),
        ...streakData,
        recentLogs
      };
    } else {
      // Use memory database
      habit = memoryDB.findHabitById(req.params.id);
      
      if (!habit || habit.userId !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Habit not found'
        });
      }
      
      // Add mock streak data
      habit = {
        ...habit,
        currentStreak: Math.floor(Math.random() * 10) + 1,
        longestStreak: Math.floor(Math.random() * 20) + 5,
        recentLogs: []
      };
    }

    res.status(200).json({
      success: true,
      data: habit
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
    let habit;
    
    if (isMongoConnected()) {
      // Use MongoDB
      habit = await Habit.findOneAndUpdate(
        { _id: req.params.id, userId },
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
    } else {
      // Use memory database
      const existingHabit = memoryDB.findHabitById(req.params.id);
      if (!existingHabit || existingHabit.userId !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Habit not found'
        });
      }
      
      habit = memoryDB.updateHabit(req.params.id, req.body);
    }

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
    let result;
    
    if (isMongoConnected()) {
      // Use MongoDB
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
      
      result = true;
    } else {
      // Use memory database
      const existingHabit = memoryDB.findHabitById(req.params.id);
      if (!existingHabit || existingHabit.userId !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Habit not found'
        });
      }
      
      result = memoryDB.deleteHabit(req.params.id);
    }

    if (!result) {
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