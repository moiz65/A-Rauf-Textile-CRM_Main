// import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
// import ReportsTable from '../components/ReportsTable';
// import SummaryCard from '../components/SummaryCard';
// import RecentActivity from '../components/RecentActivity';
import DataTable from '../components/DataTable';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ReportData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const report = location.state?.report;

  if (!report) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600 mb-4">No report data found.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen p-3">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <Header name="A RAUF TEXTILE" />
          
          {/* Summary Cards */}
          

          {/* Reports Table and Recent Activity */}
          <section className="grid grid-cols-1 lg:grid-cols-1 gap-5">
            
            <div className="lg:col-span-3">
              <DataTable/>
            </div>
            
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReportData;