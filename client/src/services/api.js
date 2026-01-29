const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Habits API
  async getHabits() {
    return this.request('/habits');
  }

  async createHabit(habitData) {
    return this.request('/habits', {
      method: 'POST',
      body: JSON.stringify(habitData),
    });
  }

  async updateHabit(habitId, updates) {
    return this.request(`/habits/${habitId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteHabit(habitId) {
    return this.request(`/habits/${habitId}`, {
      method: 'DELETE',
    });
  }

  // Logs API (One-Tap Check-in)
  async toggleHabitCompletion(habitId, date = null) {
    return this.request('/logs/toggle', {
      method: 'POST',
      body: JSON.stringify({ habitId, date }),
    });
  }

  async getHabitLogs(habitId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/logs/habit/${habitId}?${queryString}`);
  }

  // Stats API (for Recharts)
  async getDashboardStats() {
    return this.request('/stats/dashboard');
  }

  async getHabitAnalytics(habitId, days = 30) {
    return this.request(`/stats/habit/${habitId}?days=${days}`);
  }

  // Health check
  async healthCheck() {
    const response = await fetch('http://localhost:8080/health');
    return response.json();
  }
}

export default new ApiService();