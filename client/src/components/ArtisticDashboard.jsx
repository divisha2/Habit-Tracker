import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import HeatmapCalendar from './HeatmapCalendar';
import TrendChart from './TrendChart';
import AddHabitModal from './AddHabitModal';
import { getRandomQuote } from '../utils/motivationalQuotes';
import { subDays, format } from 'date-fns';

// Mock data
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

const ArtisticDashboard = () => {
  const [habits, setHabits] = useState(mockHabits);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [currentQuote] = useState(getRandomQuote());
  const [analytics] = useState(generateAnalytics());

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const percentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const handleToggle = (habitId) => {
    setHabits(prev => prev.map(habit => 
      habit._id === habitId 
        ? { ...habit, completedToday: !habit.completedToday }
        : habit
    ));
  };

  const handleDelete = (habitId) => {
    setHabits(prev => prev.filter(h => h._id !== habitId));
  };

  const handleEdit = (habitId, currentName) => {
    setEditingId(habitId);
    setEditName(currentName);
  };

  const handleSaveEdit = (habitId) => {
    setHabits(prev => prev.map(h =>
      h._id === habitId ? { ...h, name: editName } : h
    ));
    setEditingId(null);
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

  return (
    <div className="min-h-screen bg-accent">
      {/* Header Section */}
      <div className="bg-secondary text-surface px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-display text-5xl font-bold mb-2">
                Habit Tracker
              </h1>
              <p className="text-primary text-lg">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <button
              onClick={() => setShowAddHabit(true)}
              className="bg-primary hover:bg-opacity-90 text-surface px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Habit
            </button>
          </div>

          {/* Quote Section */}
          <div className="border-l-4 border-primary pl-6 py-4">
            <p className="text-surface italic text-lg mb-2">
              "{currentQuote.text}"
            </p>
            <p className="text-primary text-sm">
              — {currentQuote.author}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Progress Overview */}
        <div className="mb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-secondary mb-2">
                Today's Progress
              </h2>
              <p className="text-muted">
                {completedToday} of {totalHabits} habits completed
              </p>
            </div>
            <div className="text-right">
              <div className="font-display text-5xl font-bold text-primary">
                {percentage}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-surface rounded-full overflow-hidden shadow-sm">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-surface rounded-lg p-8 shadow-sm">
            <h3 className="font-display text-2xl font-bold text-secondary mb-6">
              Activity Heatmap
            </h3>
            <HeatmapCalendar data={analytics.heatmapData} />
          </div>
          
          <div className="bg-surface rounded-lg p-8 shadow-sm">
            <h3 className="font-display text-2xl font-bold text-secondary mb-6">
              30-Day Trend
            </h3>
            <TrendChart data={analytics.weeklyTrend} type="area" />
          </div>
        </div>

        {/* Habits Section */}
        <div>
          <h2 className="font-display text-3xl font-bold text-secondary mb-8">
            Your Habits
          </h2>

          {habits.length === 0 ? (
            <div className="bg-surface rounded-lg p-12 text-center shadow-sm">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="font-display text-2xl font-bold text-secondary mb-2">
                Start Your Journey
              </h3>
              <p className="text-muted mb-6">
                Create your first habit to begin tracking your progress.
              </p>
              <button
                onClick={() => setShowAddHabit(true)}
                className="bg-primary hover:bg-opacity-90 text-surface px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Create First Habit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {habits.map((habit) => (
                <HabitCardArtistic
                  key={habit._id}
                  habit={habit}
                  isEditing={editingId === habit._id}
                  editName={editName}
                  onToggle={() => handleToggle(habit._id)}
                  onEdit={() => handleEdit(habit._id, habit.name)}
                  onSaveEdit={() => handleSaveEdit(habit._id)}
                  onDelete={() => handleDelete(habit._id)}
                  onEditNameChange={setEditName}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Habit Modal */}
      <AddHabitModal
        isOpen={showAddHabit}
        onClose={() => setShowAddHabit(false)}
        onSave={handleCreateHabit}
      />
    </div>
  );
};

// Artistic Habit Card Component
const HabitCardArtistic = ({
  habit,
  isEditing,
  editName,
  onToggle,
  onEdit,
  onSaveEdit,
  onDelete,
  onEditNameChange
}) => {
  const currentStreak = habit.currentStreak || 0;
  const longestStreak = habit.longestStreak || 0;

  return (
    <div className="bg-surface rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => onEditNameChange(e.target.value)}
              className="w-full font-semibold text-secondary bg-accent px-2 py-1 rounded border border-primary"
              autoFocus
            />
          ) : (
            <h3 className="font-semibold text-secondary text-lg mb-1">
              {habit.name}
            </h3>
          )}
          <p className="text-sm text-muted capitalize">{habit.category}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <button
                onClick={onSaveEdit}
                className="p-2 hover:bg-accent rounded transition-colors"
                title="Save"
              >
                <Check className="w-4 h-4 text-success" />
              </button>
              <button
                onClick={() => onEditNameChange(habit.name)}
                className="p-2 hover:bg-accent rounded transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4 text-muted" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="p-2 hover:bg-accent rounded transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4 text-muted" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 hover:bg-accent rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-muted" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Check Button */}
      <button
        onClick={onToggle}
        className={`w-full h-12 rounded-lg mb-4 font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
          habit.completedToday
            ? 'bg-success text-surface'
            : 'bg-accent text-secondary border-2 border-primary hover:bg-primary hover:text-surface'
        }`}
      >
        {habit.completedToday ? (
          <>
            <Check className="w-5 h-5" />
            Completed
          </>
        ) : (
          'Mark Complete'
        )}
      </button>

      {/* Streak Info */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-secondary">Current Streak</span>
            <span className="text-lg font-bold text-primary">{currentStreak}</span>
          </div>
          <div className="h-2 bg-accent rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${Math.min(100, (currentStreak / 30) * 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-secondary">Best Streak</span>
            <span className="text-lg font-bold text-secondary">{longestStreak}</span>
          </div>
          <div className="h-2 bg-accent rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary transition-all duration-300"
              style={{ width: `${Math.min(100, (longestStreak / 30) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisticDashboard;