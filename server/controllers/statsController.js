import Habit from '../models/Habit.js';
import Log from '../models/Log.js';
import memoryDB from '../utils/memoryDB.js';
import { subDays, format, startOfDay } from 'date-fns';

// Check if MongoDB is connected
const isMongoConnected = () => {
  return process.env.MONGODB_CONNECTED === 'true';
};

// Generate mock analytics data only if user has some habits
const generateMockAnalytics = (userHasHabits = false) => {
  if (!userHasHabits) {
    return { heatmapData: [], weeklyTrend: [] };
  }
  
  const today = new Date();
  const heatmapData = [];
  const weeklyTrend = [];
  
  // Generate minimal heatmap data (last 30 days only)
  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i);
    const value = Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0;
    if (value > 0) {
      heatmapData.push({
        day: format(date, 'yyyy-MM-dd'),
        value
      });
    }
  }
  
  // Generate minimal trend data (last 7 days only)
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const completions = Math.random() > 0.5 ? Math.floor(Math.random() * 2) + 1 : 0;
    weeklyTrend.push({
      date: format(date, 'yyyy-MM-dd'),
      completions,
      percentage: Math.round((completions / 3) * 100)
    });
  }
  
  return { heatmapData, weeklyTrend };
};

// @desc    Get dashboard statistics (formatted for Recharts)
// @route   GET /api/stats/dashboard
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let stats;
    
    if (isMongoConnected()) {
      // Use MongoDB
      const today = new Date();
      const thirtyDaysAgo = subDays(today, 30);
      const sixMonthsAgo = subDays(today, 180);
      
      // Get user's habits
      const habits = await Habit.find({ userId, isActive: true });
      const habitIds = habits.map(h => h._id);
      
      // Get logs for heatmap (last 6 months)
      const heatmapLogs = await Log.aggregate([
        {
          $match: {
            userId,
            habitId: { $in: habitIds },
            date: { $gte: startOfDay(sixMonthsAgo) },
            completed: true
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            value: { $sum: 1 }
          }
        },
        {
          $project: {
            day: "$_id",
            value: 1,
            _id: 0
          }
        }
      ]);
      
      // Get logs for trend chart (last 30 days)
      const trendLogs = await Log.aggregate([
        {
          $match: {
            userId,
            habitId: { $in: habitIds },
            date: { $gte: startOfDay(thirtyDaysAgo) },
            completed: true
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            completions: { $sum: 1 }
          }
        },
        {
          $project: {
            date: "$_id",
            completions: 1,
            percentage: { $multiply: [{ $divide: ["$completions", habits.length] }, 100] },
            _id: 0
          }
        },
        { $sort: { date: 1 } }
      ]);
      
      stats = {
        heatmapData: heatmapLogs,
        weeklyTrend: trendLogs,
        totalHabits: habits.length,
        activeStreaks: habits.length // Simplified
      };
    } else {
      // Use memory database with minimal mock data
      const habits = memoryDB.findHabitsByUserId(userId);
      const hasHabits = habits.length > 0;
      
      stats = generateMockAnalytics(hasHabits);
      stats.totalHabits = habits.length;
      stats.activeStreaks = hasHabits ? Math.floor(habits.length * 0.7) : 0;
    }
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get habit-specific analytics
// @route   GET /api/stats/habit/:habitId
// @access  Private
export const getHabitAnalytics = async (req, res, next) => {
  try {
    const { habitId } = req.params;
    const { days = 30 } = req.query;
    const userId = req.user.id;
    
    let analytics;
    
    if (isMongoConnected()) {
      // Use MongoDB
      const habit = await Habit.findOne({ _id: habitId, userId });
      if (!habit) {
        return res.status(404).json({
          success: false,
          message: 'Habit not found'
        });
      }
      
      const startDate = subDays(new Date(), parseInt(days));
      
      // Get completion data
      const logs = await Log.find({
        habitId,
        userId,
        date: { $gte: startOfDay(startDate) },
        completed: true
      }).sort({ date: 1 });
      
      // Calculate analytics
      const totalDays = parseInt(days);
      const completedDays = logs.length;
      const completionRate = Math.round((completedDays / totalDays) * 100);
      
      // Generate daily data for chart
      const dailyData = [];
      for (let i = totalDays - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const hasLog = logs.some(log => format(log.date, 'yyyy-MM-dd') === dateStr);
        
        dailyData.push({
          date: dateStr,
          completed: hasLog ? 1 : 0,
          streak: 0 // Calculate streak separately if needed
        });
      }
      
      analytics = {
        habit: habit.name,
        period: `${days} days`,
        completionRate,
        completedDays,
        totalDays,
        dailyData,
        currentStreak: 5, // Simplified
        longestStreak: 12 // Simplified
      };
    } else {
      // Use memory database with mock data
      const habit = memoryDB.findHabitById(habitId);
      if (!habit || habit.userId !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Habit not found'
        });
      }
      
      // Generate mock analytics
      const totalDays = parseInt(days);
      const completedDays = Math.floor(totalDays * 0.7); // 70% completion rate
      const completionRate = Math.round((completedDays / totalDays) * 100);
      
      const dailyData = [];
      for (let i = totalDays - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const completed = Math.random() > 0.3 ? 1 : 0;
        
        dailyData.push({
          date: dateStr,
          completed,
          streak: 0
        });
      }
      
      analytics = {
        habit: habit.name,
        period: `${days} days`,
        completionRate,
        completedDays,
        totalDays,
        dailyData,
        currentStreak: Math.floor(Math.random() * 10) + 1,
        longestStreak: Math.floor(Math.random() * 20) + 5
      };
    }
    
    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overall user statistics
// @route   GET /api/stats/overview
// @access  Private
export const getOverviewStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let overview;
    
    if (isMongoConnected()) {
      // Use MongoDB
      const habits = await Habit.find({ userId, isActive: true });
      const today = startOfDay(new Date());
      
      // Get today's completions
      const todayLogs = await Log.find({
        userId,
        date: today,
        completed: true
      });
      
      // Get this week's completions
      const weekStart = subDays(today, 7);
      const weekLogs = await Log.find({
        userId,
        date: { $gte: weekStart },
        completed: true
      });
      
      overview = {
        totalHabits: habits.length,
        completedToday: todayLogs.length,
        completedThisWeek: weekLogs.length,
        completionRateToday: habits.length > 0 ? Math.round((todayLogs.length / habits.length) * 100) : 0,
        activeStreaks: habits.length // Simplified
      };
    } else {
      // Use memory database with mock data
      const habits = memoryDB.findHabitsByUserId(userId);
      const completedToday = Math.floor(habits.length * 0.6); // 60% completion
      
      overview = {
        totalHabits: habits.length,
        completedToday,
        completedThisWeek: Math.floor(habits.length * 4.2), // Average 4.2 per week
        completionRateToday: habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0,
        activeStreaks: Math.floor(habits.length * 0.8) // 80% have active streaks
      };
    }
    
    res.status(200).json({
      success: true,
      data: overview
    });
  } catch (error) {
    next(error);
  }
};