import React, { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, Calendar, Flame, Award, Zap, Heart } from 'lucide-react';
import HabitCard from './HabitCard';
import ProgressRing from './ProgressRing';
import AddHabitModal from './AddHabitModal';
import HeatmapCalendar from './HeatmapCalendar';
import TrendChart from './TrendChart';
import ConfettiEffect from './ConfettiEffect';
import { getRandomQuote, getRandomCelebration, getRandomEncouragement } from '../utils/motivationalQuotes';
import { subDays, format } from 'date-fns';

// Enhanced mock data with more variety
const mockHabits = [
  {
    _id: '1',
    name: 'Morning Water 💧',
    category: 'health',
    completedToday: true,
    currentStreak: 12,
    longestStreak: 25
  },
  {
    _id: '2',
    name: 'Meditation 🧘‍♂️',
    category: 'mindfulness',
    completedToday: false,
    currentStreak: 8,
    longestStreak: 15
  },
  {
    _id: '3',
    name: 'Read 30min 📚',
    category: 'learning',
    completedToday: true,
    currentStreak: 5,
    longestStreak: 18
  },
  {
    _id: '4',
    name: 'Exercise 💪',
    category: 'fitness',
    completedToday: true,
    currentStreak: 3,
    longestStreak: 10
  },
  {
    _id: '5',
    name: 'Gratitude Journal ✨',
    category: 'mindfulness',
    completedToday: false,
    currentStreak: 0,
    longestStreak: 7
  }
];

const generateMockAnalytics = () => {
  const today = new Date();
  
  // Generate heatmap data
  const heatmapData = [];
  for (let i = 180; i >= 0; i--) {
    const date = subDays(today, i);
    const value = Math.random() > 0.2 ? Math.floor(Math.random() * 5) + 1 : 0;
    if (value > 0) {
      heatmapData.push({
        day: format(date, 'yyyy-MM-dd'),
        value
      });
    }
  }
  
  // Generate trend data
  const weeklyTrend = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const completions = Math.floor(Math.random() * 5) + 1;
    weeklyTrend.push({
      date: format(date, 'yyyy-MM-dd'),
      completions,
      percentage: Math.round((completions / 5) * 100)
    });
  }
  
  return { heatmapData, weeklyTrend };
};

const MotivationalDashboard = () => {
  const [habits, setHabits] = useState(mockHabits);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(getRandomQuote());
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [analytics] = useState(generateMockAnalytics());

  // Rotate quotes every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(getRandomQuote());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleHabitToggle = (habitId) => {
    setHabits(prev => prev.map(habit => {
      if (habit._id === habitId) {
        const wasCompleted = habit.completedToday;
        const newCompleted = !wasCompleted;
        
        // Trigger celebration for completion
        if (newCompleted) {
          setShowConfetti(true);
          setCelebrationMessage(getRandomCelebration());
          setTimeout(() => setCelebrationMessage(''), 3000);
        }
        
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
      name: `${habitData.name} ${getHabitEmoji(habitData.category)}`,
      completedToday: false,
      currentStreak: 0,
      longestStreak: 0
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const getHabitEmoji = (category) => {
    const emojis = {
      health: '💚',
      fitness: '💪',
      mindfulness: '🧘‍♂️',
      learning: '📚',
      productivity: '⚡',
      creative: '🎨',
      social: '👥',
      other: '⭐'
    };
    return emojis[category] || '⭐';
  };

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const percentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const totalStreak = habits.reduce((sum, h) => sum + (h.currentStreak || 0), 0);
  const bestStreak = Math.max(...habits.map(h => h.longestStreak || 0), 0);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 relative">
      <ConfettiEffect trigger={showConfetti} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header with Greeting */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold gradient-text text-shadow-lg mb-2">
                Good {getTimeOfDay()}, Champion! 🌟
              </h1>
              <p className="text-zen-600 text-lg">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <button
              onClick={() => setShowAddHabit(true)}
              className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
            >
              <Plus className="w-6 h-6" />
              Add New Habit
            </button>
          </div>

          {/* Celebration Message */}
          {celebrationMessage && (
            <div className="motivational-card mb-6 bg-gradient-to-r from-success-400/20 to-primary-400/20 border-success-300/50 animate-celebrate">
              <div className="text-center">
                <div className="text-2xl font-bold text-success-700 mb-2">
                  {celebrationMessage}
                </div>
                <div className="text-success-600">
                  Keep up the amazing work! 🚀
                </div>
              </div>
            </div>
          )}

          {/* Motivational Quote */}
          <div className="quote-card animate-float">
            <div className="text-center">
              <div className="text-lg font-medium text-purple-800 mb-2">
                "{currentQuote.text}"
              </div>
              <div className="text-sm text-purple-600">
                — {currentQuote.author}
              </div>
            </div>
          </div>
        </header>

        {/* Main Stats Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Progress Ring */}
          <div className="lg:col-span-1">
            <div className="motivational-card text-center">
              <h3 className="text-lg font-semibold text-zen-800 mb-4 flex items-center justify-center gap-2">
                <Target className="w-5 h-5 text-primary-500" />
                Today's Progress
              </h3>
              <ProgressRing
                percentage={percentage}
                completed={completedToday}
                total={totalHabits}
                className="mx-auto"
              />
              <div className="mt-4 text-sm text-zen-600">
                {percentage === 100 ? "Perfect day! 🎉" : 
                 percentage >= 80 ? "Almost there! 💪" :
                 percentage >= 50 ? "Great progress! 🌟" :
                 "Every step counts! 🌱"}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="motivational-card stats-card-blue rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Calendar className="w-8 h-8" />
                <div>
                  <div className="text-3xl font-bold">{totalHabits}</div>
                  <div className="text-sm opacity-90">Active Habits</div>
                </div>
              </div>
              <div className="text-xs opacity-75">Building your future! 🏗️</div>
            </div>

            <div className="motivational-card stats-card-orange rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Flame className="w-8 h-8" />
                <div>
                  <div className="text-3xl font-bold">{totalStreak}</div>
                  <div className="text-sm opacity-90">Total Streaks</div>
                </div>
              </div>
              <div className="text-xs opacity-75">You're on fire! 🔥</div>
            </div>

            <div className="motivational-card stats-card-purple rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Award className="w-8 h-8" />
                <div>
                  <div className="text-3xl font-bold">{bestStreak}</div>
                  <div className="text-sm opacity-90">Best Streak</div>
                </div>
              </div>
              <div className="text-xs opacity-75">Legend status! 🏆</div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <HeatmapCalendar 
            data={analytics.heatmapData}
            className="xl:col-span-1"
          />
          <TrendChart 
            data={analytics.weeklyTrend}
            type="area"
            className="xl:col-span-1"
          />
        </div>

        {/* Habits Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold gradient-text flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary-500" />
              Your Habit Journey
            </h2>
            <div className="text-sm text-zen-600 bg-white/50 px-3 py-1 rounded-full">
              {getRandomEncouragement()}
            </div>
          </div>
          
          {habits.length === 0 ? (
            <div className="motivational-card text-center py-12">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold gradient-text mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-zen-600 mb-6 text-lg">
                Every expert was once a beginner. Let's build your first habit!
              </p>
              <button
                onClick={() => setShowAddHabit(true)}
                className="btn-primary text-lg px-8 py-4"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Habit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

        {/* Motivational Footer */}
        <footer className="mt-12 text-center">
          <div className="motivational-card bg-gradient-to-r from-primary-50/80 to-purple-50/80 border-primary-200/50">
            <div className="flex items-center justify-center gap-4 text-primary-700">
              <Heart className="w-6 h-6 text-pink-500" />
              <span className="text-lg font-medium">
                You're doing amazing! Keep building those habits, one day at a time. 💫
              </span>
              <Heart className="w-6 h-6 text-pink-500" />
            </div>
          </div>
        </footer>

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

// Helper function to get time-based greeting
const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
};

export default MotivationalDashboard;