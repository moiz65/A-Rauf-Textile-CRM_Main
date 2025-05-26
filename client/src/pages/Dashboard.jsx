import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ExpenseChart from '../components/ExpenseChart';
import PaymentSummary from '../components/PaymentSummary';
import StatsCard from '../components/StatsCard';
import QuickActions from '../components/QuickActions';
import TransactionHistory from '../components/TransactionHistory';

const Dashboard = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <Header name="A RAUF TEXTILE" />
        
        {/* Dashboard Content */}
        <main className="p-4 md:p-6 space-y-6">
          {/* Quick Actions */}
          <QuickActions />
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <StatsCard 
              title="Total Revenue"
              amount={124500}
              change="+12%"
              changeType="up"
              color="green"
              currency="PKR"
            />
            <StatsCard 
              title="Total Expenses"
              amount={89300}
              change="+5%"
              changeType="up"
              color="red"
              currency="PKR"
            />
            <StatsCard 
              title="Net Profit"
              amount={35200}
              change="+24%"
              changeType="up"
              color="green"
              currency="PKR"
            />
          </div>
          
          {/* Charts and Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <ExpenseChart />
              
            </div>
            <TransactionHistory />
            <div className="lg:col-span-2">
              <PaymentSummary />
              
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;