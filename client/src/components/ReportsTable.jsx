import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Add this import
import { Search, Filter, FileDown, Ellipsis, Edit, Trash2, Printer, Download, Copy, Plus, Eye } from 'lucide-react';

const REPORT_TABS = ['All', 'Pending', 'Being Prepared', 'On The Way', 'Delivered', 'Cancelled'];
const ITEMS_PER_PAGE = 4;

const ReportsTable = ({ reports: initialReports, activeTab, setActiveTab, onCreateReport }) => {
  const [reports, setReports] = useState(initialReports);
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
  const [editingReport, setEditingReport] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingReport] = useState(null);
  const dropdownRefs = useRef([]);
  const navigate = useNavigate(); // <-- Add this line

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

  const filteredReports = reports
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

  const handleView = (report) => {
    // navigate to DataTable.jsx, passing report id or data if needed
    navigate('/datatable', { state: { report } });
    setActiveDropdown(null);
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const handleDelete = (report) => {
    if (window.confirm(`Are you sure you want to delete report ${report.id}?`)) {
      setReports(prev => prev.filter(item => item.id !== report.id));
    }
    setActiveDropdown(null);
  };

  const handlePrint = (report) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Report: ${report.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            .report { border: 1px solid #ddd; padding: 20px; max-width: 500px; margin: 0 auto; }
            .row { display: flex; margin-bottom: 10px; }
            .label { font-weight: bold; width: 150px; }
            .value { flex: 1; }
            .status {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
            }
            .Pending { background-color: #fef3c7; color: #92400e; }
            .Preparing { background-color: #dbeafe; color: #1e40af; }
            .Cancelled { background-color: #fee2e2; color: #991b1b; }
            .Delivered { background-color: #dcfce7; color: #166534; }
            .On\\ the\\ way { background-color: #dbeafe; color: #1e40af; }
          </style>
        </head>
        <body>
          <h1>Order Report</h1>
          <div class="report">
            <div class="row"><div class="label">Order ID:</div><div class="value">${report.id}</div></div>
            <div class="row"><div class="label">Date:</div><div class="value">${report.date}</div></div>
            <div class="row"><div class="label">Customer:</div><div class="value">${report.customer}</div></div>
            <div class="row"><div class="label">Price:</div><div class="value">PKR ${Number(report.price).toLocaleString()}</div></div>
            <div class="row"><div class="label">Status:</div><div class="value"><span class="status ${report.status.replace(' ', '\\ ')}">${report.status}</span></div></div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setActiveDropdown(null);
  };

  const handleDownload = (report) => {
    const data = {
      orderId: report.id,
      date: report.date,
      customer: report.customer,
      price: `PKR ${Number(report.price).toLocaleString()}`,
      status: report.status
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${report.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setActiveDropdown(null);
  };

  const handleDuplicate = (report) => {
    const newReport = {
      ...report,
      id: `${report.id}-COPY-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'Pending'
    };
    
    setReports(prev => [...prev, newReport]);
    setActiveDropdown(null);
  };

  const handleAddReport = () => {
    const newReport = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      customer: '',
      price: 0,
      status: 'Pending'
    };
    
    setEditingReport(newReport);
    setShowEditModal(true);
  };

  const handleSaveReport = (updatedReport) => {
    if (updatedReport.id) {
      setReports(prev =>
        prev.map(report =>
          report.id === updatedReport.id ? updatedReport : report
        )
      );
    } else {
      setReports(prev => [...prev, updatedReport]);
    }
    setShowEditModal(false);
    setEditingReport(null);
  };

  const handleAction = (action, report) => {
    switch (action) {
      case 'view':
        handleView(report);
        break;
      case 'edit':
        handleEdit(report);
        break;
      case 'delete':
        handleDelete(report);
        break;
      case 'print':
        handlePrint(report);
        break;
      case 'download':
        handleDownload(report);
        break;
      case 'duplicate':
        handleDuplicate(report);
        break;
      default:
        break;
    }
  };

  const EditReportModal = () => {
    const [formData, setFormData] = useState(editingReport);
    
    useEffect(() => {
      setFormData(editingReport);
    }, []);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSaveReport(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            {formData.id ? 'Edit Report' : 'Create New Report'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
                disabled={formData.id.startsWith('ORD-')}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
                min="0"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="Pending">Pending</option>
                <option value="Preparing">Being Prepared</option>
                <option value="On the way">On The Way</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ViewReportModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">View Report Details</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
              <p className="mt-1 text-sm text-gray-900">{viewingReport.id}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="mt-1 text-sm text-gray-900">{viewingReport.date}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Customer</h3>
              <p className="mt-1 text-sm text-gray-900">{viewingReport.customer}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Price</h3>
              <p className="mt-1 text-sm text-gray-900">PKR {Number(viewingReport.price).toLocaleString()}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1">
                <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusClass(viewingReport.status)}`}>
                  {viewingReport.status}
                </span>
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowViewModal(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
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
              onClick={handleAddReport}
              className="flex items-center gap-1 bg-[#1976D2] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Report</span>
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
                                  onClick={() => handleAction('view', report)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </button>
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
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-white gap-3">
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
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === pageNum
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  } border`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === totalPages
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                } border`}
              >
                {totalPages}
              </button>
            )}
            
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

      {/* Modals */}
      {showEditModal && <EditReportModal />}
      {showViewModal && <ViewReportModal />}
    </div>
  );
};

const reports = [
  { id: '813789', date: 'Feb 08, 2025', customer: 'Noor Textile', price: '90000', status: 'Pending' },
  { id: '813790', date: 'Feb 08, 2025', customer: 'Malik Fabrics', price: '90000', status: 'Preparing' },
  { id: '813791', date: 'Feb 08, 2025', customer: 'Ahmed Textiles', price: '90000', status: 'Cancelled' },
  { id: '813792', date: 'Feb 08, 2025', customer: 'Ahmed Textiles', price: '90000', status: 'Delivered' },
  { id: '813793', date: 'Feb 08, 2025', customer: 'Zainab Cloth House', price: '90000', status: 'On the way' },
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