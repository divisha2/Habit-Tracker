import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download, Calendar, TrendingUp } from 'lucide-react';
import HeatmapCalendar from './HeatmapCalendar';
import TrendChart from './TrendChart';
import HabitAnalytics from './HabitAnalytics';
import useHabitStore from '../store/habitStore';
import apiService from '../services/api';

const AnalyticsPage = ({ onBack }) => {
  const { dashboardStats, setDashboardStats, setLoading, setError } = useHabitStore();
  const [chartType, setChartType] = useState('area'); // 'line' or 'area'

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getDashboardStats();
      setDashboardStats(response.data);
    } catch (err) {
      setError(`Failed to load analytics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (!dashboardStats) return;
    
    const exportData = {
      exportDate: new Date().toISOString(),
      todayProgress: dashboardStats.todayProgress,
      weeklyTrend: dashboardStats.weeklyTrend,
      habitStreaks: dashboardStats.habitStreaks,
      completionRates: dashboardStats.completionRates
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zen-habits-analytics-${new Date().toISOString().split('T')[0]}.json`;
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
                  Insights into your habit journey
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
                Export Data
              </button>
            </div>
          </div>
        </header>

        {dashboardStats ? (
          <div className="space-y-8">
            {/* Top Row - Heatmap and Trend */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <HeatmapCalendar 
                data={dashboardStats.heatmapData || []}
                className="xl:col-span-1"
              />
              <TrendChart 
                data={dashboardStats.weeklyTrend || []}
                type={chartType}
                className="xl:col-span-1"
              />
            </div>

            {/* Analytics Section */}
            <HabitAnalytics 
              habitStreaks={dashboardStats.habitStreaks || []}
              completionRates={dashboardStats.completionRates || []}
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
                    {dashboardStats.todayProgress?.percentage || 0}%
                  </div>
                  <div className="text-sm text-blue-700 mt-1">Today's Progress</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {dashboardStats.todayProgress?.completed || 0} of {dashboardStats.todayProgress?.total || 0} habits
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                  <div className="text-2xl font-bold text-green-600">
                    {dashboardStats.weeklyTrend?.length || 0}
                  </div>
                  <div className="text-sm text-green-700 mt-1">Days Tracked</div>
                  <div className="text-xs text-green-600 mt-1">
                    Last 30 days
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                  <div className="text-2xl font-bold text-purple-600">
                    {dashboardStats.habitStreaks?.length || 0}
                  </div>
                  <div className="text-sm text-purple-700 mt-1">Active Habits</div>
                  <div className="text-xs text-purple-600 mt-1">
                    Currently tracking
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
                  <div className="text-2xl font-bold text-orange-600">
                    {dashboardStats.heatmapData?.length || 0}
                  </div>
                  <div className="text-sm text-orange-700 mt-1">Activity Days</div>
                  <div className="text-xs text-orange-600 mt-1">
                    Last 6 months
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-96">
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-zen-600">Loading analytics...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;