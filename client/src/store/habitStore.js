import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useHabitStore = create(
  devtools(
    (set, get) => ({
      // State
      habits: [],
      dashboardStats: null,
      loading: false,
      error: null,
      
      // Actions
      setHabits: (habits) => set({ habits }),
      
      setDashboardStats: (stats) => set({ dashboardStats: stats }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      // Optimistic UI for habit completion
      toggleHabitOptimistic: (habitId) => {
        const { habits } = get();
        const updatedHabits = habits.map(habit => {
          if (habit._id === habitId) {
            return {
              ...habit,
              completedToday: !habit.completedToday,
              // Optimistically update streak (will be corrected by server response)
              currentStreak: habit.completedToday 
                ? Math.max(0, (habit.currentStreak || 0) - 1)
                : (habit.currentStreak || 0) + 1
            };
          }
          return habit;
        });
        
        set({ habits: updatedHabits });
      },
      
      // Update habit with server response
      updateHabitFromServer: (habitId, serverData) => {
        const { habits } = get();
        const updatedHabits = habits.map(habit => {
          if (habit._id === habitId) {
            return {
              ...habit,
              completedToday: serverData.log.completed,
              currentStreak: serverData.streak.currentStreak,
              longestStreak: serverData.streak.longestStreak
            };
          }
          return habit;
        });
        
        set({ habits: updatedHabits });
      },
      
      addHabit: (habit) => {
        const { habits } = get();
        set({ habits: [...habits, { ...habit, completedToday: false }] });
      },
      
      updateHabit: (habitId, updates) => {
        const { habits } = get();
        const updatedHabits = habits.map(habit => 
          habit._id === habitId ? { ...habit, ...updates } : habit
        );
        set({ habits: updatedHabits });
      },
      
      deleteHabit: (habitId) => {
        const { habits } = get();
        const updatedHabits = habits.filter(habit => habit._id !== habitId);
        set({ habits: updatedHabits });
      },
      
      // Clear all data
      clearStore: () => set({
        habits: [],
        dashboardStats: null,
        loading: false,
        error: null
      })
    }),
    {
      name: 'habit-store'
    }
  )
);

export default useHabitStore;