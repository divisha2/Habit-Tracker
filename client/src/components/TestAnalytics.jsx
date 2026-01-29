import React, { useState } from 'react';
import { ArrowLeft, Download, TrendingUp } from 'lucide-react';
import HeatmapCalendar from './HeatmapCalendar';
import TrendChart from './TrendChart';
import HabitAnalytics from './HabitAnalytics';
import { subDays, format } from 'date-fns';

// Mock data for testing visualizations
const generateMockData = () => {
  const today = new Date();
  
  // Generate heatmap data (last 6 months)
  const heatmapData = [];
  for (let i = 180; i >= 0; i--) {
    const date = subDays(today, i);
    const value = Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : 0;
    if (value > 0) {
      heatmapData.push({
        day: format(date, 'yyyy-MM-dd'),
        value
      });
    }
  }
  
  // Generate trend data (last 30 days)
  const weeklyTrend = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const completions = Math.floor(Math.random() * 4) + 1;
    weeklyTrend.push({
      date: format(date, 'yyyy-MM-dd'),
      completions,
      percentage: Math.round((completions / 4) * 100)
    });
  }
  
  // Mock habit streaks
  const habitStreaks = [
    { habitId: '1', name: 'Drink Water', category: 'health', color: '#10B981', currentStreak: 5, longestStreak: 12 },
    { habitId: '2', name: 'Morning Meditation', category: 'mindfulness', color: '#8B5CF6', currentStreak: 3, longestStreak: 8 },
    { habitId: '3', name: 'Read 30 Minutes', category: 'learning', color: '#F59E0B', currentStreak: 7, longestStreak: 15 },
    { habitId: '4', name: 'Exercise', category: 'fitness', color: '#EF4444', currentStreak: 2, longestStreak: 6 },
    { habitId: '5', name: 'Write Journal', category: 'creative', color: '#6366F1', currentStreak: 4, longestStreak: 9 }
  ];
  
  // Mock completion rates
  const completionRates = habitStreaks.map(habit => ({
    ...habit,
    completionRate: Math.floor(Math.random() * 40) + 60, // 60-100%
    totalLogs: Math.floor(Math.random() * 20) + 10,
    completedLogs: Math.floor(Math.random() * 15) + 8,
    totalPossibleDays: 30
  }));
  
  return {
    todayProgress: { completed: 3, total: 5, percentage: 60 },
    heatmapData,
    weeklyTrend,
    habitStreaks,
    completionRates
  };
};

const TestAnalytics = ({ onBack }) => {
  const [chartType, setChartType] = useState('area');
  const [mockData] = useState(generateMockData());

  const handleExportData = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      ...mockData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zen-habits-analytics-demo-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/80 zen-transition"
              >
                <ArrowLeft className="w-5 h-5 text-zen-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-zen-800 text-shadow">
                  Analytics Dashboard
                </h1>
                <p className="text-zen-600">
                  Insights into your habit journey (Demo Data)
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Chart Type Toggle */}
              <div className="flex items-center gap-1 glass-card rounded-xl p-1">
                <button
                  onClick={() => setChartType('area')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium zen-transition ${
                    chartType === 'area' 
                      ? 'bg-white text-zen-800 shadow-sm' 
                      : 'text-zen-600 hover:text-zen-800'
                  }`}
                >
                  Area
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium zen-transition ${
                    chartType === 'line' 
                      ? 'bg-white text-zen-800 shadow-sm' 
                      : 'text-zen-600 hover:text-zen-800'
                  }`}
                >
                  Line
                </button>
              </div>

              <button
                onClick={handleExportData}
                className="zen-button-secondary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Demo Data
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {/* Top Row - Heatmap and Trend */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <HeatmapCalendar 
              data={mockData.heatmapData}
              className="xl:col-span-1"
            />
            <TrendChart 
              data={mockData.weeklyTrend}
              type={chartType}
              className="xl:col-span-1"
            />
          </div>

          {/* Analytics Section */}
          <HabitAnalytics 
            habitStreaks={mockData.habitStreaks}
            completionRates={mockData.completionRates}
          />

          {/* Detailed Stats */}
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-zen-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Detailed Statistics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                <div className="text-2xl font-bold text-blue-600">
                  {mockData.todayProgress.percentage}%
                </div>
                <div className="text-sm text-blue-700 mt-1">Today's Progress</div>
                <div className="text-xs text-blue-600 mt-1">
                  {mockData.todayProgress.completed} of {mockData.todayProgress.total} habits
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                <div className="text-2xl font-bold text-green-600">
                  {mockData.weeklyTrend.length}
                </div>
                <div className="text-sm text-green-700 mt-1">Days Tracked</div>
                <div className="text-xs text-green-600 mt-1">
                  Last 30 days
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                <div className="text-2xl font-bold text-purple-600">
                  {mockData.habitStreaks.length}
                </div>
                <div className="text-sm text-purple-700 mt-1">Active Habits</div>
                <div className="text-xs text-purple-600 mt-1">
                  Currently tracking
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
                <div className="text-2xl font-bold text-orange-600">
                  {mockData.heatmapData.length}
                </div>
                <div className="text-sm text-orange-700 mt-1">Activity Days</div>
                <div className="text-xs text-orange-600 mt-1">
                  Last 6 months
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAnalytics;