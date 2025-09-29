const API_BASE_URL = 'http://localhost:5000/api';

class ExpenseService {
  static async getCategoryStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/expense-categories-stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw error;
    }
  }

  static async getExpenseStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses-stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching expense stats:', error);
      throw error;
    }
  }
}

export default ExpenseService;