import React, { useState } from 'react';
import { X } from 'lucide-react';
import { HABIT_CATEGORIES, CATEGORY_COLORS } from '../../../shared/types.js';

const AddHabitModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'health',
    color: CATEGORY_COLORS.health,
    frequency: 'daily'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      setFormData({
        name: '',
        description: '',
        category: 'health',
        color: CATEGORY_COLORS.health,
        frequency: 'daily'
      });
      onClose();
    } catch (error) {
      console.error('Failed to create habit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (category) => {
    setFormData({
      ...formData,
      category,
      color: CATEGORY_COLORS[category]
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Click outside to close */}
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div className="bg-white rounded-2xl w-full max-w-md shadow-lg animate-slide-up relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-secondary font-display">New Habit</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-6 h-6 text-muted" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Habit Name */}
          <div>
            <label className="block text-base font-semibold text-secondary mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Morning Water"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-base"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-base font-semibold text-secondary mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Why is this important?"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-base"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-base font-semibold text-secondary mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(HABIT_CATEGORIES).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCategoryChange(value)}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    formData.category === value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-secondary hover:bg-gray-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-base font-semibold text-secondary mb-2">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-base"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Actions - VISIBLE BUTTONS */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg font-semibold text-secondary bg-gray-100 hover:bg-gray-200 transition-colors text-base"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || isSubmitting}
              className="flex-1 px-4 py-3 rounded-lg font-semibold text-white bg-primary hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base"
            >
              {isSubmitting ? 'Creating...' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;