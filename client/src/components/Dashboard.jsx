import React, { useEffect, useState } from 'react';
import { Plus, Target, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import HabitCard from './HabitCard';
import ProgressRing from './ProgressRing';
import AddHabitModal from './AddHabitModal';
import AnalyticsPage from './AnalyticsPage';
import useHabitStore from '../store/habitStore';
import apiService from '../services/api';
import clsx from 'clsx';

const Dashboard = () => {
  const {
    habits,
    dashboardStats,
    loading,
    error,
    setHabits,
    setDashboardStats,
    setLoading,
    setError,
    toggleHabitOptimistic,
    updateHabitFromServer,
    addHabit
  } = useHabitStore();

  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [habitsResponse, statsResponse] = await Promise.all([
        apiService.getHabits(),
        apiService.getDashboardStats()
      ]);
      
      setHabits(habitsResponse.data);
      setDashboardStats(statsResponse.data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle habit toggle with optimistic UI
  const handleHabitToggle = async (habitId) => {
    // Optimistic update
    toggleHabitOptimistic(habitId);
    
    try {
      // Server request
      const response = await apiService.toggleHabitCompletion(habitId);
      
      // Update with server response
      updateHabitFromServer(habitId, response.data);
      
      // Refresh dashboard stats
      const statsResponse = await apiService.getDashboardStats();
      setDashboardStats(statsResponse.data);
      
    } catch (err) {
      // Revert optimistic update on error
      toggleHabitOptimistic(habitId);
      setError(`Failed to update habit: ${err.message}`);
    }
  };

  // Handle habit creation
  const handleCreateHabit = async (habitData) => {
    try {
      const response = await apiService.createHabit(habitData);
      addHabit(response.data);
      
      // Refresh dashboard stats
      const statsResponse = await apiService.getDashboardStats();
      setDashboardStats(statsResponse.data);
      
    } catch (err) {
      setError(`Failed to create habit: ${err.message}`);
      throw err;
    }
  };

  const todayProgress = dashboardStats?.todayProgress || { completed: 0, total: 0, percentage: 0 };

  if (showAnalytics) {
    return <AnalyticsPage onBack={() => setShowAnalytics(false)} />;
  }

  if (loading && habits.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-3xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-zen-600">Loading your zen space...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-zen-800 text-shadow mb-2">
                Zen Habits
              </h1>
              <p className="text-zen-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAnalytics(true)}
                className="zen-button-secondary flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Analytics
              </button>
              
              <button
                onClick={() => setShowAddHabit(true)}
                className="zen-button-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Habit
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="glass-card rounded-2xl p-4 border-red-200 bg-red-50/70 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 text-xs mt-1"
              >
                Dismiss
              </button>
            </div>
          )}
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Progress - Radial Ring */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-6 text-center">
              <h3 className="text-lg font-semibold text-zen-800 mb-4 flex items-center justify-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Today's Progress
              </h3>
              <ProgressRing
                percentage={todayProgress.percentage}
                completed={todayProgress.completed}
                total={todayProgress.total}
                className="mx-auto"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Habits */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-zen-800">
                    {habits.length}
                  </div>
                  <div className="text-sm text-zen-600">
                    Active Habits
                  </div>
                </div>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-zen-800">
                    {todayProgress.percentage}%
                  </div>
                  <div className="text-sm text-zen-600">
                    Completion Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Best Streak */}
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🔥</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-zen-800">
                    {Math.max(...habits.map(h => h.longestStreak || 0), 0)}
                  </div>
                  <div className="text-sm text-zen-600">
                    Best Streak
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Habits Grid */}
        <section>
          <h2 className="text-2xl font-semibold text-zen-800 mb-6 flex items-center gap-2">
            <span>Your Habits</span>
            {loading && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </h2>
          
          {habits.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">🧘‍♂️</div>
              <h3 className="text-xl font-semibold text-zen-800 mb-2">
                Start Your Zen Journey
              </h3>
              <p className="text-zen-600 mb-6">
                Create your first habit to begin tracking your daily progress.
              </p>
              <button
                onClick={() => setShowAddHabit(true)}
                className="zen-button-primary"
              >
                Create First Habit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {habits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  onToggle={handleHabitToggle}
                  isLoading={loading}
                />
              ))}
            </div>
          )}
        </section>

        {/* Add Habit Modal */}
        <AddHabitModal
          isOpen={showAddHabit}
          onClose={() => setShowAddHabit(false)}
          onSave={handleCreateHabit}
        />
      </div>
    </div>
  );
};

export default Dashboard;