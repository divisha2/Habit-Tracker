import User from '../models/User.js';
import memoryDB from '../utils/memoryDB.js';

// Check if MongoDB is connected
const isMongoConnected = () => {
  return process.env.MONGODB_CONNECTED === 'true';
};

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    let users;

    if (isMongoConnected()) {
      users = await User.find({}).select('-password');
    } else {
      // Get all users from memory database
      users = Array.from(memoryDB.users.values()).map(user => ({
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users'
    });
  }
};

// @desc    Get all habits (Admin only)
// @route   GET /api/admin/habits
// @access  Private/Admin
export const getAllHabits = async (req, res) => {
  try {
    let habits;

    if (isMongoConnected()) {
      // If using MongoDB, you'd implement this with Habit model
      habits = [];
    } else {
      // Get all habits from memory database
      habits = Array.from(memoryDB.habits.values());
    }

    res.status(200).json({
      success: true,
      count: habits.length,
      data: habits
    });
  } catch (error) {
    console.error('Get all habits error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch habits'
    });
  }
};

// @desc    Get all logs (Admin only)
// @route   GET /api/admin/logs
// @access  Private/Admin
export const getAllLogs = async (req, res) => {
  try {
    let logs;

    if (isMongoConnected()) {
      // If using MongoDB, you'd implement this with Log model
      logs = [];
    } else {
      // Get all logs from memory database
      logs = Array.from(memoryDB.logs.values());
    }

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    console.error('Get all logs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch logs'
    });
  }
};

// @desc    Get database statistics (Admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDatabaseStats = async (req, res) => {
  try {
    let stats;

    if (isMongoConnected()) {
      // MongoDB stats would go here
      stats = {
        database: 'MongoDB',
        connected: true,
        users: 0,
        habits: 0,
        logs: 0
      };
    } else {
      // Memory database stats
      stats = {
        database: 'In-Memory',
        connected: true,
        users: memoryDB.users.size,
        habits: memoryDB.habits.size,
        logs: memoryDB.logs.size,
        uptime: process.uptime(),
        memory: process.memoryUsage()
      };
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get database stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch database stats'
    });
  }
};

// @desc    Clear all data (Admin only - Development)
// @route   DELETE /api/admin/clear
// @access  Private/Admin
export const clearAllData = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Clear data not allowed in production'
      });
    }

    if (!isMongoConnected()) {
      // Clear memory database
      memoryDB.clear();
    }

    res.status(200).json({
      success: true,
      message: 'All data cleared successfully'
    });
  } catch (error) {
    console.error('Clear data error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to clear data'
    });
  }
};