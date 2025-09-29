import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ReportsTable from '../components/ReportsTable';

const Report = () => {
  const [activeTab, setActiveTab] = useState('All');

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
        
        {/* Reports Table - Full Width */}
        <section className="w-full">
          <ReportsTable 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
          />
        </section>
      </div>
    </div>
  );
};

export default Report;
