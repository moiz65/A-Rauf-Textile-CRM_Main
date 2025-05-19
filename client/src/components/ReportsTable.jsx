import React from 'react';
import { Search, Filter, FileDown, Ellipsis } from 'lucide-react';

const ReportsTable = ({ reports, activeTab, setActiveTab, onCreateReport }) => {
  const reportTabs = ['All', 'Pending', 'Being Prepared', 'On The Way', 'Delivered', 'Cancelled'];

  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Preparing': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'On the way': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-[30px] shadow-sm border border-gray-100 p-4 sm:p-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Reports</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            View and manage all your reports in one place
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="pl-10 pr-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={onCreateReport}
              className="bg-[#1976D2] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors w-full sm:w-auto text-center"
            >
              Create New Report
            </button>
            
            <button className="flex items-center gap-1 bg-white border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-gray-50">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Filter</span>
            </button>
            
            <button className="flex items-center gap-1 bg-white border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-gray-50">
              <FileDown className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Export</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="overflow-x-auto mb-4">
        <div className="flex border-b w-max min-w-full">
          {reportTabs.map(tab => (
            <button
              key={tab}
              className={`px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === tab 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-left text-xs sm:text-sm font-normal text-black">
              <th className="pb-3 px-2 whitespace-nowrap">Order ID</th>
              <th className="pb-3 px-2 whitespace-nowrap">Date</th>
              <th className="pb-3 px-2 whitespace-nowrap hidden xs:table-cell">Customer</th>
              <th className="pb-3 px-2 whitespace-nowrap">Price</th>
              <th className="pb-3 px-2 whitespace-nowrap">Status</th>
              <th className="pb-3 px-2 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="py-3 px-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                  {report.id}
                </td>
                <td className="py-3 px-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                  {report.date}
                </td>
                <td className="py-3 px-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap hidden xs:table-cell">
                  {report.customer}
                </td>
                <td className="py-3 px-2 text-xs sm:text-sm font-medium whitespace-nowrap">
                  PKR {report.price}
                </td>
                <td className="py-3 px-2 whitespace-nowrap">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] xs:text-xs font-medium ${getStatusClass(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className="py-3 px-2 whitespace-nowrap">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Ellipsis className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {reports.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-500">
          No reports found
        </div>
      )}
    </div>
  );
};

export default ReportsTable;