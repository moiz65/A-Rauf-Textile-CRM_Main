import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ReportsTable from '../components/ReportsTable';
import SummaryCard from '../components/SummaryCard';
import RecentActivity from '../components/RecentActivity';

const Report = () => {
  const [activeTab, setActiveTab] = useState('All');

  // The ReportsTable now handles its own data fetching with enhanced filtering
  // We don't need to fetch reports here anymore

  const summaryData = [
    {
      title: "Today's Revenue",
      amount: "2,837.90",
      currency: "PKR",
      indicator: { text: "+10%", color: "blue" },
    },
    {
      title: "Today's Expenses",
      amount: "25,938.86",
      currency: "PKR",
      indicator: { text: "-5%", color: "red" },
    },
    {
      title: "Overdue Invoices",
      amount: "6,947.00",
      currency: "PKR",
      indicator: { text: "+7", color: "green" },
    },
    {
      title: "Upcoming Payments",
      amount: "6,947.00",
      currency: "PKR",
      indicator: { text: "5 New", color: "yellow" },
    },
  ];
  
  const recentActivities = [
    {
      id: '1',
      name: 'Zain',
      value: '7,242',
      percentage: '+7.34%',
      trend: 'up',
      initial: 'Z',
      color: 'bg-blue-500',
    },
    {
      id: '2',
      name: 'Samsen',
      value: '4,384',
      percentage: '-3.85%',
      trend: 'down',
      initial: 'S',
      color: 'bg-teal-500',
    },
    {
      id: '3',
      name: 'Nikom',
      value: '539',
      percentage: '-1.48%',
      trend: 'down',
      initial: 'N',
      color: 'bg-green-500',
    },
    {
      id: '4',
      name: 'Pasion',
      value: '539',
      percentage: '-2.48%',
      trend: 'down',
      initial: 'P',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen p-4">
      {/* Sidebar */}
      <div className="hidden md:block fixed h-screen w-64 z-20">
        <Sidebar />
      </div>
      {/* Main Content */}
      <div className="flex-1 p-6 bg-[#F5F5F5] md:ml-64">
        {/* Header */}
        <Header name="A RAUF TEXTILE" />
        
        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {summaryData.map((item, index) => (
            <SummaryCard
              key={index}
              title={item.title}
              amount={item.amount}
              currency={item.currency}
              indicator={item.indicator}
            />
          ))}
        </section>

        {/* Reports Table and Recent Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-3">
            <ReportsTable 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
            />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity customers={recentActivities} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Report;