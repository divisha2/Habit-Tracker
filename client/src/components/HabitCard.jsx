import React, { useState } from 'react';
import { Check, Flame, TrendingUp, Star } from 'lucide-react';
import { CATEGORY_COLORS } from '../../../shared/types.js';
import { getRandomCelebration } from '../utils/motivationalQuotes';
import clsx from 'clsx';

const HabitCard = ({ habit, onToggle, isLoading = false }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleToggle = async () => {
    if (isLoading || isAnimating) return;
    
    setIsAnimating(true);
    
    // Show celebration for completion
    if (!habit.completedToday) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
    
    try {
      await onToggle(habit._id);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const categoryColor = CATEGORY_COLORS[habit.category] || '#6B7280';
  const currentStreak = habit.currentStreak || 0;
  const longestStreak = habit.longestStreak || 0;

  // Determine card style based on completion and streak
  const getCardStyle = () => {
    if (habit.completedToday) {
      return 'motivational-card bg-gradient-to-br from-success-50/80 to-success-100/80 border-success-200/50 celebration-glow';
    }
    if (currentStreak >= 7) {
      return 'motivational-card bg-gradient-to-br from-primary-50/80 to-orange-50/80 border-primary-200/50';
    }
    return 'motivational-card hover:shadow-2xl';
  };

  const getStreakMessage = () => {
    if (currentStreak >= 30) return "Legendary! 🏆";
    if (currentStreak >= 21) return "Habit Master! 👑";
    if (currentStreak >= 14) return "On Fire! 🔥";
    if (currentStreak >= 7) return "Week Strong! 💪";
    if (currentStreak >= 3) return "Building! 🌱";
    return "Start Today! ✨";
  };

  return (
    <div className={clsx(
      getCardStyle(),
      'rounded-3xl p-6 smooth-transition hover:scale-105',
      isAnimating && 'animate-celebrate',
      showCelebration && 'celebration-bounce'
    )}>
      {/* Celebration Message */}
      {showCelebration && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-success-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce z-10">
          {getRandomCelebration().split(' ')[0]} {/* First emoji/word */}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-zen-800 mb-2 text-shadow">
            {habit.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-4 h-4 rounded-full shadow-sm"
              style={{ backgroundColor: categoryColor }}
            />
            <span className="text-sm text-zen-600 capitalize font-medium">
              {habit.category}
            </span>
          </div>
          <div className="text-xs text-zen-500 font-medium">
            {getStreakMessage()}
          </div>
        </div>
        
        {/* Enhanced Check Button */}
        <button
          onClick={handleToggle}
          disabled={isLoading || isAnimating}
          className={clsx(
            'habit-check relative',
            habit.completedToday 
              ? 'habit-check-checked' 
              : 'habit-check-unchecked',
            (isLoading || isAnimating) && 'opacity-70 cursor-not-allowed'
          )}
        >
          {habit.completedToday ? (
            <Check className="w-8 h-8 text-white drop-shadow-sm" />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-zen-400 opacity-50" />
          )}
          
          {/* Streak indicator */}
          {currentStreak > 0 && (
            <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
              {currentStreak}
            </div>
          )}
        </button>
      </div>

      {/* Enhanced Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Current Streak */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Flame className={clsx(
              'w-5 h-5',
              currentStreak > 0 ? 'streak-flame' : 'text-zen-400'
            )} />
          </div>
          <div className="text-xl font-bold text-zen-800">
            {currentStreak}
          </div>
          <div className="text-xs text-zen-600">Current</div>
        </div>

        {/* Best Streak */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-xl font-bold text-zen-800">
            {longestStreak}
          </div>
          <div className="text-xs text-zen-600">Best</div>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className={clsx(
              'w-5 h-5',
              habit.completedToday ? 'text-success-500' : 'text-zen-400'
            )} />
          </div>
          <div className={clsx(
            'text-sm font-bold',
            habit.completedToday ? 'text-success-600' : 'text-zen-500'
          )}>
            {habit.completedToday ? 'Done!' : 'Pending'}
          </div>
          <div className="text-xs text-zen-600">Today</div>
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zen-600">
          <span>Weekly Progress</span>
          <span className="font-semibold">{Math.min(currentStreak, 7)}/7 days</span>
        </div>
        <div className="h-3 bg-zen-200/50 rounded-full overflow-hidden">
          <div 
            className={clsx(
              'h-full rounded-full smooth-transition',
              currentStreak >= 7 
                ? 'bg-gradient-to-r from-success-400 to-success-500' 
                : 'bg-gradient-to-r from-primary-400 to-primary-500'
            )}
            style={{ 
              width: `${Math.min(100, (currentStreak / 7) * 100)}%` 
            }}
          />
        </div>
      </div>

      {/* Motivational Badge */}
      {currentStreak >= 7 && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            <Flame className="w-3 h-3" />
            Streak Master!
          </span>
        </div>
      )}
    </div>
  );
};

export default HabitCard;