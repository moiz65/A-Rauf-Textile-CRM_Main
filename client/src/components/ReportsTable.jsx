import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, FileDown, Ellipsis, Edit, Trash2, Printer, Download, Copy } from 'lucide-react';

const REPORT_TABS = ['All', 'Pending', 'Being Prepared', 'On The Way', 'Delivered', 'Cancelled'];
const ITEMS_PER_PAGE = 4;
const ROW_HEIGHT = 64; // Approximate height of each row in pixels
const TABLE_HEADER_HEIGHT = 48; // Approximate height of table header in pixels

const ReportsTable = ({ reports: initialReports, activeTab, setActiveTab, onCreateReport }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    customer: '',
    minPrice: '',
    maxPrice: '',
    dateFrom: '',
    dateTo: ''
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRefs = useRef([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRefs.current.every(ref => !ref?.contains(event.target))) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Filtering logic
  const filteredReports = initialReports
    .filter(report =>
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.date.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(report =>
      activeTab === 'All' ||
      (activeTab === 'Being Prepared' && report.status === 'Preparing') ||
      (activeTab === 'On The Way' && report.status === 'On the way') ||
      report.status === activeTab
    )
    .filter(report =>
      (!filters.minPrice || Number(report.price) >= Number(filters.minPrice)) &&
      (!filters.maxPrice || Number(report.price) <= Number(filters.maxPrice)) &&
      (!filters.dateFrom || new Date(report.date) >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || new Date(report.date) <= new Date(filters.dateTo)) &&
      (!filters.customer || report.customer.toLowerCase().includes(filters.customer.toLowerCase()))
    );

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleReports = filteredReports.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const tableHeight = TABLE_HEADER_HEIGHT + (Math.min(visibleReports.length, ITEMS_PER_PAGE) * ROW_HEIGHT);

  const toggleSelectAll = () => {
    if (selectedRows.length === visibleReports.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(visibleReports.map(report => report.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedRows([]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      customer: '',
      minPrice: '',
      maxPrice: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchTerm('');
    setActiveTab('All');
  };

  const toggleDropdown = (dropdownKey, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === dropdownKey ? null : dropdownKey);
  };

  const handleAction = (action, report) => {
    setActiveDropdown(null);
    switch (action) {
      case 'edit':
        alert(`Editing report: ${report.id}`);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete report ${report.id}?`)) {
          alert(`Report ${report.id} deleted`);
        }
        break;
      case 'print':
        alert(`Printing report: ${report.id}`);
        break;
      case 'download':
        alert(`Downloading report: ${report.id}`);
        break;
      case 'duplicate':
        alert(`Duplicating report: ${report.id}`);
        break;
      default:
        break;
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={onCreateReport}
              className="bg-[#1976D2] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors w-full sm:w-auto text-center"
            >
              Create New Report
            </button>
            
            <button 
              className="flex items-center gap-1 bg-white border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
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

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Customer</label>
            <input
              type="text"
              name="customer"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.customer}
              onChange={handleFilterChange}
              placeholder="Filter by customer name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Min Price</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md text-xs"
              placeholder="Minimum price"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md text-xs"
              placeholder="Maximum price"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md text-xs"
            />
          </div>
          <div className="md:col-span-5 flex justify-end gap-2">
            <button 
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="overflow-x-auto mb-4">
        <div className="flex border-b w-max min-w-full">
          {REPORT_TABS.map(tab => (
            <button
              key={tab}
              className={`px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === tab 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {/* Table with fixed height */}
      <div className="overflow-x-auto">
        <div className="relative min-w-full min-h-[350px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-center text-xs sm:text-sm font-normal text-black">
                <th className="pb-3 px-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={
                      visibleReports.length > 0 &&
                      selectedRows.length === visibleReports.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                </th>
                <th className="pb-3 px-2 whitespace-nowrap">Order ID</th>
                <th className="pb-3 px-2 whitespace-nowrap">Date</th>
                <th className="pb-3 px-2 whitespace-nowrap">Customer</th>
                <th className="pb-3 px-2 whitespace-nowrap">Price</th>
                <th className="pb-3 px-2 whitespace-nowrap">Status</th>
                <th className="pb-3 px-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="text-center divide-y divide-gray-100">
              {visibleReports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-sm text-gray-500">
                    No reports found matching your criteria
                  </td>
                </tr>
              ) : (
                visibleReports.map((report, index) => {
                  const dropdownKey = report.id + '-' + index;
                  return (
                    <tr key={dropdownKey} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(report.id)}
                          onChange={() => toggleSelectRow(report.id)}
                          className="rounded text-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {report.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {report.date}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {report.customer}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        PKR {Number(report.price).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusClass(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap relative">
                        <div className="flex justify-center">
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={(e) => toggleDropdown(dropdownKey, e)}
                          >
                            <Ellipsis className="h-5 w-5" />
                          </button>
                          {activeDropdown === dropdownKey && (
                            <div
                              ref={el => dropdownRefs.current[index] = el}
                              className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200"
                              style={{
                                top: '100%',
                                maxHeight: '200px',
                                overflowY: 'auto'
                              }}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => handleAction('edit', report)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleAction('delete', report)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </button>
                                <button
                                  onClick={() => handleAction('print', report)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Printer className="w-4 h-4 mr-2" />
                                  Print
                                </button>
                                <button
                                  onClick={() => handleAction('download', report)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </button>
                                <button
                                  onClick={() => handleAction('duplicate', report)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicate
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredReports.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-white">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredReports.length)} of {filteredReports.length}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 border rounded-md text-sm ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Example usage with your provided data
const reports = [
  { id: '813789', date: 'Feb 08, 2022', customer: 'Noor Textile', price: '90000', status: 'Pending' },
  { id: '813789', date: 'Feb 08, 2022', customer: 'Malik Fabrics', price: '90000', status: 'Preparing' },
  { id: '813789', date: 'Feb 08, 2022', customer: 'Ahmed Textiles', price: '90000', status: 'Cancelled' },
  { id: '813789', date: 'Feb 08, 2022', customer: 'Ahmed Textiles', price: '90000', status: 'Delivered' },
  { id: '813789', date: 'Feb 08, 2022', customer: 'Zainab Cloth House', price: '90000', status: 'On the way' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('All');
  return (
    <ReportsTable 
      reports={reports} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onCreateReport={() => console.log('Create new report')} 
    />
  );
}