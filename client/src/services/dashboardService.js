const API_BASE_URL = 'http://localhost:5000/api';

class DashboardAPI {
  static async getDashboardSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }

  static async getMonthlyExpenses() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/monthly-expenses`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching monthly expenses:', error);
      throw error;
    }
  }

  static async getTransactionHistory(page = 1, limit = 5) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/transactions?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }
}

export default DashboardAPI;