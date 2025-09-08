import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import InvoiceHeader from '../components/InvoiceDetails';
import InvoiceDetails from '../components/InvoiceDetails';
import SummaryPanel from '../components/SummaryPanel';

const InvoiceTemplate = () => {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:block fixed h-full w-64 z-20">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <Header name="A RAUF TEXTILE" />
        
        {/* Invoice Header */}
        <InvoiceHeader />
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Invoice Details */}
          <div className="flex-1 overflow-y-auto p-4">
            <InvoiceDetails />
          </div>
          
          {/* Summary Panel */}
          <div className="w-full md:w-96 lg:w-1/3 xl:w-1/4">
            <SummaryPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;