import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ExpenseTable from '../components/ExpenseTable';
import CategoryTable from '../components/CategoryTable';

const Expense = () => {
  const [activeView, setActiveView] = useState('expenses'); // 'expenses' or 'categories'

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen p-4">
      {/* Sidebar */}
      <div className="hidden md:block fixed h-screen w-64 z-20">
        <Sidebar />
      </div>
      {/* Main Content */}
      <main className="flex-1 p-6 bg-[#F5F5F5] md:ml-64">
        <Header name="A RAUF TEXTILE" />
        
        {/* Toggle Buttons */}
        <div className="mb-6">
          <div className="flex bg-white rounded-lg p-1 w-fit shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveView('expenses')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeView === 'expenses'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveView('categories')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeView === 'categories'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Categories
            </button>
          </div>
        </div>

        {/* Content Based on Active View */}
        {activeView === 'expenses' ? <ExpenseTable /> : <CategoryTable />}
      </main>
    </div>
  );
};

export default Expense;
