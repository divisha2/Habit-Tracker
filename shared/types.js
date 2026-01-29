// Shared type definitions and constants

export const HABIT_CATEGORIES = {
  HEALTH: 'health',
  PRODUCTIVITY: 'productivity',
  MINDFULNESS: 'mindfulness',
  LEARNING: 'learning',
  FITNESS: 'fitness',
  SOCIAL: 'social',
  CREATIVE: 'creative',
  OTHER: 'other'
};

export const HABIT_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  CUSTOM: 'custom'
};

// Clean color palette - using your specified colors
export const CATEGORY_COLORS = {
  [HABIT_CATEGORIES.HEALTH]: '#DA627D',      // Coral
  [HABIT_CATEGORIES.PRODUCTIVITY]: '#243B4A', // Navy
  [HABIT_CATEGORIES.MINDFULNESS]: '#DA627D',  // Coral
  [HABIT_CATEGORIES.LEARNING]: '#243B4A',     // Navy
  [HABIT_CATEGORIES.FITNESS]: '#DA627D',      // Coral
  [HABIT_CATEGORIES.SOCIAL]: '#243B4A',       // Navy
  [HABIT_CATEGORIES.CREATIVE]: '#DA627D',     // Coral
  [HABIT_CATEGORIES.OTHER]: '#6B7280'         // Gray
};

export const CATEGORY_ICONS = {
  [HABIT_CATEGORIES.HEALTH]: 'Heart',
  [HABIT_CATEGORIES.PRODUCTIVITY]: 'Zap',
  [HABIT_CATEGORIES.MINDFULNESS]: 'Brain',
  [HABIT_CATEGORIES.LEARNING]: 'BookOpen',
  [HABIT_CATEGORIES.FITNESS]: 'Dumbbell',
  [HABIT_CATEGORIES.SOCIAL]: 'Users',
  [HABIT_CATEGORIES.CREATIVE]: 'Palette',
  [HABIT_CATEGORIES.OTHER]: 'Circle'
};