import React from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';

const HabitsList = ({ 
  habits, 
  editingId, 
  editName, 
  onToggle, 
  onEdit, 
  onSaveEdit, 
  onDelete, 
  onEditNameChange 
}) => {
  const completedCount = habits.filter(h => h.completedToday).length;
  const totalCount = habits.length;

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h4 className="text-lg font-semibold text-secondary">
          Today's Habits
        </h4>
        <div className="text-xs text-muted font-medium">
          {completedCount}/{totalCount} done
        </div>
      </div>

      {/* Habits List - No scroll, clean layout */}
      {habits.length === 0 ? (
        <div className="text-center py-8 flex-1 flex items-center justify-center">
          <div>
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-muted text-sm mb-2">No habits yet</p>
            <p className="text-xs text-muted">Add your first habit to get started!</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="space-y-2">
            {habits.map((habit) => (
              <HabitListItem
                key={habit._id}
                habit={habit}
                isEditing={editingId === habit._id}
                editName={editName}
                onToggle={() => onToggle(habit._id)}
                onEdit={() => onEdit(habit._id, habit.name)}
                onSaveEdit={() => onSaveEdit(habit._id)}
                onDelete={() => onDelete(habit._id)}
                onEditNameChange={onEditNameChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats - Always visible at bottom */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 flex-shrink-0">
        <div className="text-center">
          <p className="text-xs text-muted">Completed</p>
          <p className="text-lg font-bold text-primary">
            {completedCount}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted">Remaining</p>
          <p className="text-lg font-bold text-secondary">
            {totalCount - completedCount}
          </p>
        </div>
      </div>
    </div>
  );
};

// Improved Habit List Item
const HabitListItem = ({
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

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 group hover:shadow-sm">
      {/* Check Button */}
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          habit.completedToday
            ? 'bg-primary border-primary text-white shadow-sm'
            : 'border-gray-300 hover:border-primary hover:bg-primary/5'
        }`}
      >
        {habit.completedToday && <Check className="w-4 h-4" />}
      </button>

      {/* Habit Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => onEditNameChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-primary rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveEdit();
              if (e.key === 'Escape') onEditNameChange(habit.name);
            }}
          />
        ) : (
          <div>
            <p className={`text-sm font-medium truncate transition-all duration-200 ${
              habit.completedToday 
                ? 'text-muted line-through' 
                : 'text-secondary'
            }`}>
              {habit.name}
            </p>
            {currentStreak > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-primary font-medium">
                  {currentStreak} day{currentStreak !== 1 ? 's' : ''}
                </span>
                <span className="text-xs">🔥</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {isEditing ? (
          <>
            <button
              onClick={onSaveEdit}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
              title="Save changes"
            >
              <Check className="w-4 h-4 text-primary" />
            </button>
            <button
              onClick={() => onEditNameChange(habit.name)}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
              title="Cancel editing"
            >
              <X className="w-4 h-4 text-muted" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onEdit}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
              title="Edit habit"
            >
              <Edit2 className="w-4 h-4 text-muted hover:text-secondary" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
              title="Delete habit"
            >
              <Trash2 className="w-4 h-4 text-muted hover:text-red-500" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HabitsList;