import React, { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, Calendar, Check } from 'lucide-react';
import HeatmapCalendar from './HeatmapCalendar';
import TrendChart from './TrendChart';
import AddHabitModal from './AddHabitModal';
import { getRandomQuote } from '../utils/motivationalQuotes';
import { subDays, format } from 'date-fns';

// Clean mock data
const mockHabits = [
  {
    _id: '1',
    name: 'Morning Water',
    category: 'health',
    completedToday: true,
    currentStreak: 12,
    longestStreak: 25
  },
  {
    _id: '2',
    name: 'Meditation',
    category: 'mindfulness',
    completedToday: false,
    currentStreak: 8,
    longestStreak: 15
  },
  {
    _id: '3',
    name: 'Read 30min',
    category: 'learning',
    completedToday: true,
    currentStreak: 5,
    longestStreak: 18
  },
  {
    _id: '4',
    name: 'Exercise',
    category: 'fitness',
    completedToday: false,
    currentStreak: 0,
    longestStreak: 10
  }
];

const generateAnalytics = () => {
  const today = new Date();
  
  // Heatmap data
  const heatmapData = [];
  for (let i = 180; i >= 0; i--) {
    const date = subDays(today, i);
    const value = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
    if (value > 0) {
      heatmapData.push({
        day: format(date, 'yyyy-MM-dd'),
        value
      });
    }
  }
  
  // Trend data
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
  
  return { heatmapData, weeklyTrend };
};

const CleanDashboard = () => {
  const [habits, setHabits] = useState(mockHabits);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(getRandomQuote());
  const [analytics] = useState(generateAnalytics());

  // Rotate quotes every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(getRandomQuote());
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleHabitToggle = (habitId) => {
    setHabits(prev => prev.map(habit => {
      if (habit._id === habitId) {
        const newCompleted = !habit.completedToday;
        return {
          ...habit,
          completedToday: newCompleted,
          currentStreak: newCompleted 
            ? (habit.currentStreak || 0) + 1 
            : Math.max(0, (habit.currentStreak || 0) - 1)
        };
      }
      return habit;
    }));
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
  const totalStreak = habits.reduce((sum, h) => sum + (h.currentStreak || 0), 0);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-navy mb-2">
                Good {getTimeOfDay()}
              </h1>
              <p className="text-gray-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <button
              onClick={() => setShowAddHabit(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Habit
            </button>
          </div>

          {/* Motivational Quote */}
          <div className="card p-4 bg-cream-light border-cream-dark">
            <p className="text-navy font-medium text-center">
              "{currentQuote.text}"
            </p>
            <p className="text-gray-600 text-sm text-center mt-2">
              — {currentQuote.author}
            </p>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stats-card">
            <div className="w-12 h-12 bg-coral rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-navy mb-1">{percentage}%</div>
            <div className="text-sm text-gray-600">Today's Progress</div>
          </div>

          <div className="stats-card">
            <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-navy mb-1">{totalHabits}</div>
            <div className="text-sm text-gray-600">Active Habits</div>
          </div>

          <div className="stats-card">
            <div className="w-12 h-12 bg-coral rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-navy mb-1">{totalStreak}</div>
            <div className="text-sm text-gray-600">Total Streaks</div>
          </div>

          <div className="stats-card">
            <div className="w-12 h-12 bg-cream-dark rounded-xl flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-navy" />
            </div>
            <div className="text-2xl font-bold text-navy mb-1">{completedToday}</div>
            <div className="text-sm text-gray-600">Completed Today</div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="analytics-card">
            <h3 className="text-lg font-semibold text-navy mb-4">Activity Overview</h3>
            <HeatmapCalendar data={analytics.heatmapData} />
          </div>
          
          <div className="analytics-card">
            <h3 className="text-lg font-semibold text-navy mb-4">30-Day Trend</h3>
            <TrendChart data={analytics.weeklyTrend} type="area" />
          </div>
        </div>

        {/* Habits Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-navy">Your Habits</h2>
            <div className="text-sm text-gray-600">
              {completedToday} of {totalHabits} completed
            </div>
          </div>
          
          {habits.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-cream-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-navy" />
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">
                Start Your Journey
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first habit to begin tracking your progress.
              </p>
              <button
                onClick={() => setShowAddHabit(true)}
                className="btn-primary"
              >
                Create First Habit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {habits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  onToggle={handleHabitToggle}
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

// Clean Habit Card Component
const HabitCard = ({ habit, onToggle }) => {
  const currentStreak = habit.currentStreak || 0;
  const longestStreak = habit.longestStreak || 0;

  return (
    <div className="habit-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-navy mb-1">{habit.name}</h3>
          <p className="text-sm text-gray-600 capitalize">{habit.category}</p>
        </div>
        
        <button
          onClick={() => onToggle(habit._id)}
          className={`habit-check ${
            habit.completedToday ? 'habit-check-checked' : 'habit-check-unchecked'
          }`}
        >
          {habit.completedToday && <Check className="w-5 h-5" />}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-navy">{currentStreak}</div>
          <div className="text-xs text-gray-600">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-navy">{longestStreak}</div>
          <div className="text-xs text-gray-600">Best Streak</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Weekly Progress</span>
          <span>{Math.min(currentStreak, 7)}/7</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-coral rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (currentStreak / 7) * 100)}%` }}
          />
        </div>
      </div>

      {habit.completedToday && (
        <div className="mt-3 text-center">
          <span className="inline-block bg-coral text-white text-xs font-medium px-3 py-1 rounded-full">
            Completed
          </span>
        </div>
      )}
    </div>
  );
};

// Helper function
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
};

export default CleanDashboard;