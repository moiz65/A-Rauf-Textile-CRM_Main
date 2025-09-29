import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ExpenseChart from '../components/ExpenseChart';
import PaymentSummary from '../components/PaymentSummary';
import StatsCard from '../components/StatsCard';
import QuickActions from '../components/QuickActions';
import TransactionHistory from '../components/TransactionHistory';
import DashboardAPI from '../services/dashboardService';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await DashboardAPI.getDashboardSummary();
      if (response.success) {
        setDashboardData(response.data);
        setError(null);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex bg-[#F5F5F5] min-h-screen p-4">
        <div className="hidden md:block fixed h-screen w-64 z-20">
          <Sidebar />
        </div>
        <div className="flex-1 p-6 bg-[#F5F5F5] md:ml-64">
          <Header name="A RAUF TEXTILE" />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-600">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex bg-[#F5F5F5] min-h-screen p-4">
        <div className="hidden md:block fixed h-screen w-64 z-20">
          <Sidebar />
        </div>
        <div className="flex-1 p-6 bg-[#F5F5F5] md:ml-64">
          <Header name="A RAUF TEXTILE" />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <button 
                onClick={fetchDashboardData}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen p-4 ">
      {/* Sidebar */}
      <div className="hidden md:block fixed h-screen w-64 z-20">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#F5F5F5] md:ml-64">
        {/* Header */}
        <Header name="A RAUF TEXTILE" />
        
        {/* Dashboard Content */}
        <main className="p-4 md:p-6 space-y-6">
          {/* Quick Actions */}
          <QuickActions dashboardData={dashboardData} />
          <div className="lg:col-span-2">
              <PaymentSummary dashboardData={dashboardData} />
            </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatsCard 
              title="Total Revenue"
              amount={dashboardData?.stats?.totalRevenue?.amount || 0}
              change={dashboardData?.stats?.totalRevenue?.change || "0%"}
              changeType={dashboardData?.stats?.totalRevenue?.changeType || "neutral"}
              color="green"
              currency="PKR"
            />
            <StatsCard 
              title="Total Expenses"
              amount={dashboardData?.stats?.totalExpenses?.amount || 0}
              change={dashboardData?.stats?.totalExpenses?.change || "0%"}
              changeType={dashboardData?.stats?.totalExpenses?.changeType || "neutral"}
              color="red"
              currency="PKR"
            />
            <StatsCard 
              title="Net Profit"
              amount={dashboardData?.stats?.netProfit?.amount || 0}
              change={dashboardData?.stats?.netProfit?.change || "0%"}
              changeType={dashboardData?.stats?.netProfit?.changeType || "neutral"}
              color="green"
              currency="PKR"
            />
            <StatsCard 
              title="Total Customers"
              amount={dashboardData?.stats?.totalCustomers?.amount || 0}
              change={dashboardData?.stats?.totalCustomers?.change || "0%"}
              changeType={dashboardData?.stats?.totalCustomers?.changeType || "neutral"}
              color="blue"
              currency=""
            />
          </div>
          
          
          {/* Charts and Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <ExpenseChart />
              
            </div>
            <TransactionHistory />
            
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
