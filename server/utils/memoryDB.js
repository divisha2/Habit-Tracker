// Simple in-memory database for development/demo purposes
// This allows the app to work without MongoDB for testing

class MemoryDB {
  constructor() {
    this.users = new Map();
    this.habits = new Map();
    this.logs = new Map();
    this.userIdCounter = 1;
    this.habitIdCounter = 1;
    this.logIdCounter = 1;
  }

  // User operations
  createUser(userData) {
    const userId = `user_${this.userIdCounter++}`;
    const user = {
      _id: userId,
      id: userId,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(userId, user);
    return user;
  }

  findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  findUserById(id) {
    return this.users.get(id);
  }

  // Habit operations
  createHabit(habitData) {
    const habitId = `habit_${this.habitIdCounter++}`;
    const habit = {
      _id: habitId,
      id: habitId,
      ...habitData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.habits.set(habitId, habit);
    return habit;
  }

  findHabitsByUserId(userId) {
    const userHabits = [];
    for (const habit of this.habits.values()) {
      if (habit.userId === userId) {
        userHabits.push(habit);
      }
    }
    return userHabits;
  }

  findHabitById(id) {
    return this.habits.get(id);
  }

  updateHabit(id, updateData) {
    const habit = this.habits.get(id);
    if (habit) {
      const updated = { ...habit, ...updateData, updatedAt: new Date() };
      this.habits.set(id, updated);
      return updated;
    }
    return null;
  }

  deleteHabit(id) {
    return this.habits.delete(id);
  }

  // Log operations
  createLog(logData) {
    const logId = `log_${this.logIdCounter++}`;
    const log = {
      _id: logId,
      id: logId,
      ...logData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.logs.set(logId, log);
    return log;
  }

  findLogsByHabitId(habitId) {
    const habitLogs = [];
    for (const log of this.logs.values()) {
      if (log.habitId === habitId) {
        habitLogs.push(log);
      }
    }
    return habitLogs;
  }

  findLogsByUserId(userId) {
    const userLogs = [];
    for (const log of this.logs.values()) {
      if (log.userId === userId) {
        userLogs.push(log);
      }
    }
    return userLogs;
  }

  findLogByHabitAndDate(habitId, date) {
    for (const log of this.logs.values()) {
      if (log.habitId === habitId && log.date === date) {
        return log;
      }
    }
    return null;
  }

  updateLog(id, updateData) {
    const log = this.logs.get(id);
    if (log) {
      const updated = { ...log, ...updateData, updatedAt: new Date() };
      this.logs.set(id, updated);
      return updated;
    }
    return null;
  }

  deleteLog(id) {
    return this.logs.delete(id);
  }

  // Clear all data
  clear() {
    this.users.clear();
    this.habits.clear();
    this.logs.clear();
    this.userIdCounter = 1;
    this.habitIdCounter = 1;
    this.logIdCounter = 1;
  }
}

// Create singleton instance
const memoryDB = new MemoryDB();

export default memoryDB;