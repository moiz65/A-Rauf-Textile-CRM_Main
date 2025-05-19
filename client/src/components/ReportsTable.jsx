import React from 'react';
import { Search, Filter, FileDown, ChevronRight } from 'lucide-react';

const ReportsTable = ({ reports, activeTab, setActiveTab }) => {
  const reportTabs = ['All', 'Pending', 'Being Prepared', 'On The Way', 'Delivered', 'Cancelled'];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'text-orange-500';
      case 'Preparing': return 'text-blue-500';
      case 'Cancelled': return 'text-red-500';
      case 'Delivered': return 'text-green-500';
      case 'On the way': return 'text-blue-500';
      default: return '';
    }
  };

  // Custom Button Component
  const Button = ({ children, variant = 'default', className = '', ...props }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors px-4 py-2';
    
    const variantClasses = {
      default: 'bg-blue-500 text-white hover:bg-blue-600',
      outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    };

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-[30px] shadow-sm border border-gray-100 p-4 sm:p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg sm:text-xl font-semibold">Reports</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-10 pr-4 py-2 border rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            <span>Export</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Create New Report
          </Button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-4">
        {reportTabs.map(tab => (
          <button
            key={tab}
            className={`py-2 px-4 text-sm ${activeTab === tab 
              ? 'text-blue-500 border-b-2 border-blue-500 font-medium' 
              : 'text-gray-600'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Custom Table Implementation */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="w-10 p-4">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="p-4">Order id</th>
              <th className="p-4">Date</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index} className="bg-gray-50">
                <td className="p-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="p-4">{report.id}</td>
                <td className="p-4">{report.date}</td>
                <td className="p-4">{report.customer}</td>
                <td className="p-4">{report.price}</td>
                <td className="p-4">
                  <span className={getStatusColor(report.status)}>
                    {report.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"/>
                      <circle cx="19" cy="12" r="1"/>
                      <circle cx="5" cy="12" r="1"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;