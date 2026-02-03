import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, subDays, startOfWeek, endOfWeek } from 'date-fns';
import ApiService from '../services/api';

const StreakCalendar = ({ habits = [], refreshKey = 0 }) => {
  const [streakData, setStreakData] = useState({});
  const [loading, setLoading] = useState(true);
  
  const today = new Date();
  const currentMonth = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  
  // Get the full calendar grid (including days from previous/next month)
  const calendarStart = startOfWeek(currentMonth);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Load real user data
  useEffect(() => {
    const loadStreakData = async () => {
      try {
        setLoading(true);
        const data = {};
        
        // Get all logs for the date range in one call
        try {
          // Fetch all logs at once
          const response = await ApiService.getLogs();
          const allLogs = response.data || [];
          
          // Group logs by date
          const logsByDate = {};
          
          allLogs.forEach(log => {
            // Ensure date is properly parsed and formatted
            const logDate = new Date(log.date);
            const dateKey = format(logDate, 'yyyy-MM-dd');
            
            if (!logsByDate[dateKey]) {
              logsByDate[dateKey] = [];
            }
            logsByDate[dateKey].push(log);
          });
          
          // Build streak data for each calendar day
          calendarDays.forEach(date => {
            const dateKey = format(date, 'yyyy-MM-dd');
            const logs = logsByDate[dateKey] || [];
            const completedCount = logs.filter(log => log.completed).length;
            
            data[dateKey] = {
              completed: completedCount,
              total: logs.length > 0 ? logs.length : (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') ? habits.length : 0)
            };
          });
        } catch (error) {
          console.error('Failed to load logs:', error);
          // Fallback to empty data
          calendarDays.forEach(date => {
            const dateKey = format(date, 'yyyy-MM-dd');
            data[dateKey] = { 
              completed: 0, 
              total: format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') ? habits.length : 0 
            };
          });
        }
        
        setStreakData(data);
      } catch (error) {
        console.error('Failed to load streak data:', error);
        setStreakData({});
      } finally {
        setLoading(false);
      }
    };

    loadStreakData();
  }, [habits, refreshKey]);

  const getIntensity = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const data = streakData[dateKey];
    
    if (!data || data.completed === 0 || data.total === 0) return 0;
    
    const percentage = data.completed / data.total;
    if (percentage >= 0.9) return 4; // Very high
    if (percentage >= 0.7) return 3; // High
    if (percentage >= 0.5) return 2; // Medium
    if (percentage >= 0.3) return 1; // Low
    return 0; // None
  };

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 4: return 'bg-[#DA627D]'; // Darkest coral (primary color)
      case 3: return 'bg-[#E17D8F]';
      case 2: return 'bg-[#E998A1]';
      case 1: return 'bg-[#F0B3B3]';
      default: return 'bg-gray-100'; // No activity
    }
  };

  const getDayInfo = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const data = streakData[dateKey];
    const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    return data || { completed: 0, total: isToday ? habits.length : 0 };
  };

  // Calculate current streak and best streak from real data
  const calculateStreaks = () => {
    if (habits.length === 0 || Object.keys(streakData).length === 0) {
      return { currentStreak: 0, bestStreak: 0 };
    }
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    // Check last 90 days for streaks
    for (let i = 0; i <= 90; i++) {
      const date = subDays(today, i);
      const dayInfo = getDayInfo(date);
      
      if (dayInfo.completed > 0 && dayInfo.total > 0) {
        tempStreak++;
        if (i === 0 || currentStreak > 0) {
          currentStreak = tempStreak;
        }
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
      } else {
        if (i === 0) {
          currentStreak = 0;
        }
        tempStreak = 0;
      }
    }
    
    return { currentStreak, bestStreak };
  };

  const { currentStreak, bestStreak } = calculateStreaks();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-secondary">
            {format(today, 'MMM yyyy')}
          </h4>
          <div className="text-xs text-muted font-medium">
            Loading...
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 42 }).map((_, index) => (
            <div key={index} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-secondary">
          {format(today, 'MMM yyyy')}
        </h4>
        <div className="text-xs text-muted font-medium">
          Streak Calendar
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="text-center text-xs font-semibold text-muted py-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map(date => {
          const intensity = getIntensity(date);
          const dayInfo = getDayInfo(date);
          const isCurrentMonth = isSameMonth(date, today);
          const isTodayDate = isToday(date);

          return (
            <div
              key={date.toISOString()}
              className={`
                relative aspect-square flex items-center justify-center text-xs font-medium rounded-lg cursor-pointer
                transition-all duration-200 hover:scale-105 hover:shadow-sm group
                ${getIntensityColor(intensity)}
                ${isTodayDate ? 'ring-2 ring-secondary ring-offset-1' : ''}
                ${!isCurrentMonth ? 'opacity-40' : ''}
                ${intensity > 0 ? 'text-white' : 'text-secondary'}
              `}
              title={`${format(date, 'MMM d')}: ${dayInfo.completed}/${dayInfo.total} habits completed`}
            >
              {format(date, 'd')}
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-secondary text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-lg">
                <div className="font-medium">{format(date, 'MMM d')}</div>
                <div>{dayInfo.completed}/{dayInfo.total} habits</div>
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-secondary"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">Less</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map(intensity => (
            <div
              key={intensity}
              className={`w-3 h-3 rounded-sm ${
                intensity === 0 ? 'bg-gray-100' :
                intensity === 1 ? 'bg-[#F0B3B3]' :
                intensity === 2 ? 'bg-[#E998A1]' :
                intensity === 3 ? 'bg-[#E17D8F]' :
                'bg-[#DA627D]'
              }`}
              title={`${intensity === 0 ? 'No' : intensity === 1 ? 'Low' : intensity === 2 ? 'Medium' : intensity === 3 ? 'High' : 'Very High'} activity`}
            />
          ))}
        </div>
        <span className="text-muted">More</span>
      </div>

      {/* Streak Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-bold text-primary">{currentStreak}</div>
          <div className="text-xs text-muted">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-secondary">{bestStreak}</div>
          <div className="text-xs text-muted">Best Streak</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary">{habits.length}</div>
          <div className="text-xs text-muted">Active Habits</div>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;