import React, { useState } from 'react';
import HabitCard from './HabitCard';
import ProgressRing from './ProgressRing';
import AddHabitModal from './AddHabitModal';
import TestAnalytics from './TestAnalytics';
import FeatureShowcase from './FeatureShowcase';
import { Plus, Target, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

// Mock data for testing without backend
const mockHabits = [
  {
    _id: '1',
    name: 'Drink Water',
    category: 'health',
    completedToday: true,
    currentStreak: 5,
    longestStreak: 12
  },
  {
    _id: '2',
    name: 'Morning Meditation',
    category: 'mindfulness',
    completedToday: false,
    currentStreak: 3,
    longestStreak: 8
  },
  {
    _id: '3',
    name: 'Read 30 Minutes',
    category: 'learning',
    completedToday: true,
    currentStreak: 7,
    longestStreak: 15
  }
];

const TestDashboard = () => {
  const [habits, setHabits] = useState(mockHabits);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleHabitToggle = (habitId) => {
    setHabits(prev => prev.map(habit => 
      habit._id === habitId 
        ? { ...habit, completedToday: !habit.completedToday }
        : habit
    ));
  };

  const handleCreateHabit = (habitData) => {
    const newHabit = {
      _id: Date.now().toString(),
      ...habitData,
      completedToday: false,
      currentStreak: 0,
      longestStreak: 0
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const percentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  if (showAnalytics) {
    return <TestAnalytics onBack={() => setShowAnalytics(false)} />;
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
        </header>

        {/* Feature Showcase */}
        <FeatureShowcase />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Progress */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-6 text-center">
              <h3 className="text-lg font-semibold text-zen-800 mb-4 flex items-center justify-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Today's Progress
              </h3>
              <ProgressRing
                percentage={percentage}
                completed={completedToday}
                total={totalHabits}
                className="mx-auto"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-zen-800">{totalHabits}</div>
                  <div className="text-sm text-zen-600">Active Habits</div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-zen-800">{percentage}%</div>
                  <div className="text-sm text-zen-600">Completion Rate</div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🔥</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-zen-800">
                    {Math.max(...habits.map(h => h.longestStreak || 0), 0)}
                  </div>
                  <div className="text-sm text-zen-600">Best Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Habits Grid */}
        <section>
          <h2 className="text-2xl font-semibold text-zen-800 mb-6">Your Habits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {habits.map((habit) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onToggle={handleHabitToggle}
              />
            ))}
          </div>
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

export default TestDashboard;