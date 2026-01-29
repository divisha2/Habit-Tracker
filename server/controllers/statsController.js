import Habit from '../models/Habit.js';
import Log from '../models/Log.js';
import { subDays, format, startOfDay } from 'date-fns';

// @desc    Get dashboard statistics (formatted for Recharts)
// @route   GET /api/stats/dashboard
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
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
    
    const stats = {
      heatmapData: heatmapLogs,
      weeklyTrend: trendLogs,
      totalHabits: habits.length,
      activeStreaks: habits.length // Simplified
    };
    
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
    
    const analytics = {
      habit: habit.name,
      period: `${days} days`,
      completionRate,
      completedDays,
      totalDays,
      dailyData,
      currentStreak: 5, // Simplified
      longestStreak: 12 // Simplified
    };
    
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
    
    const overview = {
      totalHabits: habits.length,
      completedToday: todayLogs.length,
      completedThisWeek: weekLogs.length,
      completionRateToday: habits.length > 0 ? Math.round((todayLogs.length / habits.length) * 100) : 0,
      activeStreaks: habits.length // Simplified
    };
    
    res.status(200).json({
      success: true,
      data: overview
    });
  } catch (error) {
    next(error);
  }
};