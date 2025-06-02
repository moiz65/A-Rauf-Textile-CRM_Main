import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, FileDown, Ellipsis, Edit, Trash2, Printer, Download, Copy, Plus } from 'lucide-react';

const expensesData = [
  {
    id: '1',
    title: 'Fabric Purchase',
    date: 'Feb 08, 2025',
    vendor: 'Noor Textile',
    price: 90000,
    category: 'Materials',
    paymentMethod: 'Bank Transfer',
    Reasons: 'Cotton fabric for summer collection',
    status: 'Paid'
  },
  {
    id: '2',
    title: 'Machine Maintenance',
    date: 'Mar 15, 2025',
    vendor: 'TechServ Inc.',
    price: 75000,
    category: 'Equipment',
    paymentMethod: 'Cash',
    Reasons: 'Monthly maintenance service',
    status: 'Pending'
  },
  {
    id: '3',
    title: 'Office Supplies',
    date: 'Apr 22, 2025',
    vendor: 'Stationery World',
    price: 12000,
    category: 'Administrative',
    paymentMethod: 'Credit Card',
    Reasons: 'Paper, ink, and other supplies',
    status: 'Paid'
  },
  {
    id: '4',
    title: 'Utility Bills',
    date: 'May 05, 2025',
    vendor: 'K-Electric',
    price: 45000,
    category: 'Utilities',
    paymentMethod: 'Bank Transfer',
    Reasons: 'Monthly electricity bill',
    status: 'Paid'
  },
  {
    id: '5',
    title: 'Employee Salaries',
    date: 'Jun 10, 2025',
    vendor: 'Payroll',
    price: 250000,
    category: 'Payroll',
    paymentMethod: 'Bank Transfer',
    Reasons: 'Monthly staff salaries',
    status: 'Pending'
  },
  {
    id: '6',
    title: 'Transportation',
    date: 'Jul 15, 2025',
    vendor: 'City Logistics',
    price: 18000,
    category: 'Logistics',
    paymentMethod: 'Cash',
    Reasons: 'Fabric delivery charges',
    status: 'Paid'
  },
];

const ITEMS_PER_PAGE = 4;

const ExpenseTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [filters, setFilters] = useState({
    title: '',
    vendor: '',
    minPrice: '',
    maxPrice: '',
    dateFrom: '',
    dateTo: '',
    category: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const expenseCategories = ['All', 'Materials', 'Equipment', 'Administrative', 'Utilities', 'Payroll', 'Logistics'];
  const statusOptions = ['All', 'Paid', 'Pending'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredExpenses = expensesData
    .filter(expense =>
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.Reasons.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(expense =>
      activeTab === 'All' || expense.category === activeTab
    )
    .filter(expense =>
      (!filters.title || expense.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (!filters.vendor || expense.vendor.toLowerCase().includes(filters.vendor.toLowerCase())) &&
      (!filters.minPrice || expense.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || expense.price <= Number(filters.maxPrice)) &&
      (!filters.dateFrom || new Date(expense.date) >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || new Date(expense.date) <= new Date(filters.dateTo)) &&
      (!filters.category || expense.category === filters.category) &&
      (!filters.status || expense.status === filters.status)
    );

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleExpenses = filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleSelectAll = () => {
    if (selectedRows.length === visibleExpenses.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(visibleExpenses.map(expense => expense.id));
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

  const getStatusClass = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryClass = (category) => {
    switch(category) {
      case 'Materials': return 'bg-blue-100 text-blue-800';
      case 'Equipment': return 'bg-purple-100 text-purple-800';
      case 'Administrative': return 'bg-orange-100 text-orange-800';
      case 'Utilities': return 'bg-red-100 text-red-800';
      case 'Payroll': return 'bg-indigo-100 text-indigo-800';
      case 'Logistics': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
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
      title: '',
      vendor: '',
      minPrice: '',
      maxPrice: '',
      dateFrom: '',
      dateTo: '',
      category: '',
      status: ''
    });
    setSearchTerm('');
    setActiveTab('All');
  };

  const toggleDropdown = (expenseId, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === expenseId ? null : expenseId);
  };

  const handleAction = (action, expense) => {
    setActiveDropdown(null);
    switch (action) {
      case 'edit':
        alert(`Editing expense: ${expense.title}`);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete expense ${expense.title}?`)) {
          alert(`Expense ${expense.title} deleted`);
        }
        break;
      case 'print':
        alert(`Printing expense: ${expense.title}`);
        break;
      case 'download':
        alert(`Downloading expense: ${expense.title}`);
        break;
      case 'duplicate':
        alert(`Duplicating expense: ${expense.title}`);
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
          <h2 className="text-lg sm:text-xl font-semibold">Expenses</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Track and manage all your business expenses
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search expenses..." 
              className="pl-10 pr-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button className="flex items-center gap-1 bg-[#1976D2] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Expense Title</label>
            <input
              type="text"
              name="title"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.title}
              onChange={handleFilterChange}
              placeholder="Filter by title"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Vendor</label>
            <input
              type="text"
              name="vendor"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.vendor}
              onChange={handleFilterChange}
              placeholder="Filter by vendor"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Min Amount</label>
            <input
              type="number"
              name="minPrice"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Minimum price"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Max Amount</label>
            <input
              type="number"
              name="maxPrice"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Maximum price"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              name="dateFrom"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.dateFrom}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              name="dateTo"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.dateTo}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {expenseCategories.filter(cat => cat !== 'All').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              {statusOptions.filter(stat => stat !== 'All').map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
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
          {expenseCategories.map(category => (
            <button
              key={category}
              className={`px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === category
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                setActiveTab(category);
                setCurrentPage(1);
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <div className="relative min-w-full min-h-[350px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-center text-xs sm:text-sm font-normal text-black">
                <th className="pb-3 px-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={
                      visibleExpenses.length > 0 &&
                      selectedRows.length === visibleExpenses.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                </th>
                <th className="pb-3 px-2 whitespace-nowrap">Expense</th>
                <th className="pb-3 px-2 whitespace-nowrap">Date</th>
                <th className="pb-3 px-2 whitespace-nowrap hidden sm:table-cell">Vendor</th>
                <th className="pb-3 px-2 whitespace-nowrap">Amount</th>
                <th className="pb-3 px-2 whitespace-nowrap">Category</th>
                <th className="pb-3 px-2 whitespace-nowrap hidden md:table-cell">Payment Method</th>
                <th className="pb-3 px-2 whitespace-nowrap">Status</th>
                <th className="pb-3 px-2 whitespace-nowrap hidden lg:table-cell">Reasons</th>
                <th className="pb-3 px-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="text-center divide-y divide-gray-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-4 text-center text-sm text-gray-500">
                    No expenses found matching your criteria
                  </td>
                </tr>
              ) : (
                visibleExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(expense.id)}
                        onChange={() => toggleSelectRow(expense.id)}
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {expense.title}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {expense.date}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap hidden sm:table-cell">
                      {expense.vendor}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      PKR {expense.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getCategoryClass(expense.category)}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap hidden md:table-cell">
                      {expense.paymentMethod}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusClass(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap hidden lg:table-cell">
                      <div className="max-w-xs truncate">{expense.Reasons}</div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap relative">
                      <div className="flex justify-center">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => toggleDropdown(expense.id, e)}
                        >
                          <Ellipsis className="h-5 w-5" />
                        </button>
                        
                        {activeDropdown === expense.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleAction('edit', expense)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleAction('delete', expense)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                              <button
                                onClick={() => handleAction('print', expense)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                              </button>
                              <button
                                onClick={() => handleAction('download', expense)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </button>
                              <button
                                onClick={() => handleAction('duplicate', expense)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredExpenses.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-white gap-3">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredExpenses.length)} of {filteredExpenses.length} expenses
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
              // Show pages around current page
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
    </div>
  );
};

export default ExpenseTable;