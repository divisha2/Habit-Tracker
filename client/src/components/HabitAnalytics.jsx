import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Target, Award, Calendar } from 'lucide-react';
import { CATEGORY_COLORS } from '../../../shared/types.js';

const HabitAnalytics = ({ habitStreaks = [], completionRates = [], className = '' }) => {
  // Prepare data for category distribution pie chart
  const categoryData = Object.entries(
    habitStreaks.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({
    name: category,
    value: count,
    color: CATEGORY_COLORS[category] || '#6B7280'
  }));

  // Prepare data for completion rate bar chart
  const completionData = completionRates
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 8) // Show top 8 habits
    .map(habit => ({
      name: habit.name.length > 12 ? habit.name.substring(0, 12) + '...' : habit.name,
      rate: habit.completionRate,
      color: habit.color
    }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-xl">
          <div className="font-medium text-zen-800">{label}</div>
          <div className="text-sm text-zen-600 mt-1">
            {payload[0].value}% completion rate
          </div>
        </div>
      );
    }
    return null;
  };

  const totalHabits = habitStreaks.length;
  const avgCompletionRate = completionRates.length > 0 
    ? Math.round(completionRates.reduce((sum, h) => sum + h.completionRate, 0) / completionRates.length)
    : 0;
  const bestStreak = Math.max(...habitStreaks.map(h => h.longestStreak || 0), 0);
  const activeStreaks = habitStreaks.filter(h => (h.currentStreak || 0) > 0).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-zen-800">{totalHabits}</div>
              <div className="text-xs text-zen-600">Total Habits</div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-zen-800">{avgCompletionRate}%</div>
              <div className="text-xs text-zen-600">Avg Rate</div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-zen-800">{bestStreak}</div>
              <div className="text-xs text-zen-600">Best Streak</div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-zen-800">{activeStreaks}</div>
              <div className="text-xs text-zen-600">Active Streaks</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-zen-800 mb-4 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            Habit Categories
          </h3>
          
          {categoryData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-xl">
                            <div className="font-medium text-zen-800 capitalize">
                              {payload[0].payload.name}
                            </div>
                            <div className="text-sm text-zen-600">
                              {payload[0].value} habit{payload[0].value !== 1 ? 's' : ''}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-zen-500">
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-sm">No categories yet</div>
              </div>
            </div>
          )}

          {/* Legend */}
          {categoryData.length > 0 && (
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="capitalize text-zen-700">{item.name}</span>
                  </div>
                  <span className="text-zen-600">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completion Rates */}
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-zen-800 mb-4 flex items-center gap-2">
            <span className="text-xl">📊</span>
            Completion Rates
          </h3>
          
          {completionData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    width={30}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="rate" 
                    radius={[4, 4, 0, 0]}
                    fill="#3B82F6"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-zen-500">
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-sm">No completion data yet</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitAnalytics;