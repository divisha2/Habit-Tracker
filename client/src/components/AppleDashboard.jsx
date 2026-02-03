import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Navbar from './Navbar';
import StreakCalendar from './StreakCalendar';
import HabitsList from './HabitsList';
import TrendChart from './TrendChart';
import AddHabitModal from './AddHabitModal';
import { getRandomQuote } from '../utils/motivationalQuotes';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';

const generateAnalytics = () => {
  // Return empty analytics for new users
  return {
    heatmapData: [],
    weeklyTrend: []
  };
};

const AppleDashboard = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [currentQuote] = useState(getRandomQuote());
  const [analytics, setAnalytics] = useState({ heatmapData: [], weeklyTrend: [] });
  const [calendarRefresh, setCalendarRefresh] = useState(0);

  // Load habits on component mount
  useEffect(() => {
    loadHabits();
    loadAnalytics();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getHabits();
      setHabits(data.data || []);
    } catch (err) {
      console.error('Failed to load habits:', err);
      setError('Failed to load habits');
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await ApiService.getDashboardStats();
      setAnalytics(data.data || generateAnalytics());
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setAnalytics(generateAnalytics());
    }
  };

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const percentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const handleAddHabitClick = () => {
    setShowAddHabit(true);
  };

  const handleToggle = async (habitId) => {
    try {
      await ApiService.toggleHabitCompletion(habitId);
      
      // Update local state optimistically
      setHabits(prev => prev.map(habit => 
        habit._id === habitId 
          ? { ...habit, completedToday: !habit.completedToday }
          : habit
      ));
      
      // Small delay to ensure database write completes
      setTimeout(() => {
        setCalendarRefresh(prev => prev + 1);
        loadAnalytics();
      }, 300);
    } catch (err) {
      console.error('Error toggling habit:', err);
    }
  };

  const handleDelete = async (habitId) => {
    try {
      await ApiService.deleteHabit(habitId);
      setHabits(prev => prev.filter(h => h._id !== habitId));
      // Refresh calendar after deletion
      setTimeout(() => {
        setCalendarRefresh(prev => prev + 1);
      }, 300);
    } catch (err) {
      console.error('Error deleting habit:', err);
    }
  };

  const handleEdit = (habitId, currentName) => {
    setEditingId(habitId);
    setEditName(currentName);
  };

  const handleSaveEdit = async (habitId) => {
    try {
      await ApiService.updateHabit(habitId, { name: editName });
      setHabits(prev => prev.map(h =>
        h._id === habitId ? { ...h, name: editName } : h
      ));
      setEditingId(null);
    } catch (err) {
      console.error('Error updating habit:', err);
    }
  };

  const handleCreateHabit = async (habitData) => {
    try {
      const data = await ApiService.createHabit(habitData);
      setHabits(prev => [...prev, data.data]);
      // Refresh calendar after adding new habit
      setTimeout(() => {
        setCalendarRefresh(prev => prev + 1);
      }, 300);
    } catch (err) {
      console.error('Error creating habit:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Main Container with margins */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-5xl sm:text-6xl font-bold text-secondary font-display mb-2">
                Today's Journey
              </h2>
              <p className="text-lg sm:text-xl text-muted">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <button
              onClick={handleAddHabitClick}
              className="bg-primary hover:bg-opacity-90 text-white px-8 py-3.5 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 self-start sm:self-auto text-lg"
            >
              <Plus className="w-6 h-6" />
              Add Habit
            </button>
          </div>

          {/* Motivational Quote */}
          <div className="border-l-4 border-primary pl-6 py-5 bg-accent/20 rounded-r-xl">
            <p className="text-secondary italic text-lg sm:text-xl font-medium leading-relaxed">
              "{currentQuote.text}"
            </p>
            <p className="text-muted text-sm sm:text-base mt-3">
              — {currentQuote.author}
            </p>
          </div>
        </div>

        {/* Main Content Grid - Improved Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Habits List - Fixed Height Card */}
          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow h-96">
            <HabitsList
              habits={habits}
              editingId={editingId}
              editName={editName}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onSaveEdit={handleSaveEdit}
              onDelete={handleDelete}
              onEditNameChange={setEditName}
            />
          </div>

          {/* Progress Overview */}
          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-secondary mb-3">
                  Today's Progress
                </h4>
                <div className="text-5xl font-bold text-primary mb-4">
                  {percentage}%
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-700 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-4 bg-accent/20 rounded-xl">
                  <p className="text-xs text-muted font-medium mb-2">Completed</p>
                  <p className="text-3xl font-bold text-primary">{completedToday}</p>
                </div>
                <div className="text-center p-4 bg-accent/20 rounded-xl">
                  <p className="text-xs text-muted font-medium mb-2">Remaining</p>
                  <p className="text-3xl font-bold text-secondary">{totalHabits - completedToday}</p>
                </div>
                <div className="text-center p-4 bg-accent/20 rounded-xl">
                  <p className="text-xs text-muted font-medium mb-2">Total</p>
                  <p className="text-3xl font-bold text-secondary">{totalHabits}</p>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="text-center p-4 bg-primary/5 rounded-xl">
                <p className="text-sm text-secondary font-medium">
                  {percentage === 100 ? "🎉 Perfect day!" : 
                   percentage >= 80 ? "🔥 Almost there!" :
                   percentage >= 50 ? "💪 Keep going!" :
                   "🌱 Every step counts!"}
                </p>
              </div>
            </div>
          </div>

          {/* Streak Calendar */}
          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <StreakCalendar 
              habits={habits} 
              refreshKey={calendarRefresh}
            />
          </div>
        </div>

        {/* Analytics Grid - Full Width Trend Chart */}
        <div id="analytics">
          <div className="border border-gray-200 rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-2xl font-bold text-secondary font-display">
                30-Day Completion Trend
              </h4>
              <div className="text-xs text-muted bg-accent/20 px-3 py-1 rounded-full">
                Daily Progress
              </div>
            </div>
            <div className="h-80">
              <TrendChart data={analytics.weeklyTrend} type="area" />
            </div>
          </div>
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

export default AppleDashboard;