import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ExpenseTable from '../components/ExpenseTable';

const Expense = () => {
  return (
    <div className="flex bg-[#F5F5F5] min-h-screen p-4">
      {/* Sidebar */}
      <div className="hidden md:block fixed h-screen w-64 z-20">
        <Sidebar />
      </div>
      {/* Main Content */}
      <main className="flex-1 p-6 bg-[#F5F5F5] md:ml-64">
        <Header name="A RAUF TEXTILE" />
        <ExpenseTable />
      </main>
    </div>
  );
};

export default Expense;
