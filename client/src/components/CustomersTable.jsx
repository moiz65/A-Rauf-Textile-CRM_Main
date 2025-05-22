import React, { useState } from 'react';
import { Search, Filter, FileDown, Ellipsis } from 'lucide-react';

const customersData = [
  {
    id: '1',
    name: 'Noor Textile',
    date: 'Feb 08, 2022',
    phoneNumber: '0231153636',
    price: 90000,
    category: 'Dying',
    address: 'Karachi',
    email: 'Noor@gmail.com',
    startDate: 'Feb 08, 2022',
  },
  {
    id: '2',
    name: 'Malik Fabrics',
    date: 'Mar 15, 2022',
    phoneNumber: '0231156789',
    price: 75000,
    category: 'Weaving',
    address: 'Lahore',
    email: 'malik@gmail.com',
    startDate: 'Mar 10, 2022',
  },
  {
    id: '3',
    name: 'Ahmed Textiles',
    date: 'Apr 22, 2022',
    phoneNumber: '0233456789',
    price: 120000,
    category: 'Dying',
    address: 'Islamabad',
    email: 'ahmed@gmail.com',
    startDate: 'Apr 15, 2022',
  },
  {
    id: '4',
    name: 'Zainab Cloth House',
    date: 'May 05, 2022',
    phoneNumber: '0235678901',
    price: 85000,
    category: 'Stitching',
    address: 'Faisalabad',
    email: 'zainab@gmail.com',
    startDate: 'May 01, 2022',
  },
];

const ITEMS_PER_PAGE = 4;

const CustomersTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [filters, setFilters] = useState({
    customerName: '',
    minPrice: '',
    maxPrice: '',
    dateFrom: '',
    dateTo: '',
    category: '',
    address: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const customerCategories = ['All', 'Dying', 'Weaving', 'Stitching'];

  const filteredCustomers = customersData
    .filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phoneNumber.includes(searchTerm)
    )
    .filter(customer =>
      activeTab === 'All' || customer.category === activeTab
    )
    .filter(customer =>
      (!filters.customerName || customer.name.toLowerCase().includes(filters.customerName.toLowerCase())) &&
      (!filters.minPrice || customer.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || customer.price <= Number(filters.maxPrice)) &&
      (!filters.dateFrom || new Date(customer.date) >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || new Date(customer.date) <= new Date(filters.dateTo)) &&
      (!filters.category || customer.category === filters.category) &&
      (!filters.address || customer.address.toLowerCase().includes(filters.address.toLowerCase()))
    );

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleCustomers = filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleSelectAll = () => {
    if (selectedRows.length === visibleCustomers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(visibleCustomers.map(customer => customer.id));
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

  const getCategoryClass = (category) => {
    switch(category) {
      case 'Dying': return 'bg-orange-100 text-orange-800';
      case 'Weaving': return 'bg-blue-100 text-blue-800';
      case 'Stitching': return 'bg-green-100 text-green-800';
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
      customerName: '',
      minPrice: '',
      maxPrice: '',
      dateFrom: '',
      dateTo: '',
      category: '',
      address: ''
    });
    setSearchTerm('');
    setActiveTab('All');
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-[30px] shadow-sm border border-gray-100 p-4 sm:p-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Customers</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            View and manage all your customers in one place
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="pl-10 pr-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button className="bg-[#1976D2] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors w-full sm:w-auto text-center">
              Add New Customer
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
      
      {/* Filter Panel - Positioned right below the header */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Customer Name</label>
            <input
              type="text"
              name="customerName"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.customerName}
              onChange={handleFilterChange}
              placeholder="Filter by customer name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Min Price</label>
            <input
              type="number"
              name="minPrice"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.maxPrice}
              onChange={handleFilterChange}
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
              <option value="">All</option>
              <option value="Dying">Dying</option>
              <option value="Weaving">Weaving</option>
              <option value="Stitching">Stitching</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.address}
              onChange={handleFilterChange}
              placeholder="Filter by address"
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
          {customerCategories.map(category => (
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-left text-xs sm:text-sm font-normal text-black">
              <th className="pb-3 px-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={
                    visibleCustomers.length > 0 &&
                    selectedRows.length === visibleCustomers.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
              </th>
              <th className="pb-3 px-2 whitespace-nowrap">Customer</th>
              <th className="pb-3 px-2 whitespace-nowrap">Date</th>
              <th className="pb-3 px-2 whitespace-nowrap hidden sm:table-cell">Phone</th>
              <th className="pb-3 px-2 whitespace-nowrap">Price</th>
              <th className="pb-3 px-2 whitespace-nowrap">Category</th>
              <th className="pb-3 px-2 whitespace-nowrap hidden md:table-cell">Address</th>
              <th className="pb-3 px-2 whitespace-nowrap hidden lg:table-cell">Email</th>
              <th className="pb-3 px-2 whitespace-nowrap hidden xl:table-cell">Start Date</th>
              <th className="pb-3 px-2 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="10" className="py-4 text-center text-sm text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(customer.id)}
                      onChange={() => toggleSelectRow(customer.id)}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {customer.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {customer.date}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap hidden sm:table-cell">
                    {customer.phoneNumber}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    PKR {customer.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getCategoryClass(customer.category)}`}>
                      {customer.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap hidden md:table-cell">
                    {customer.address}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap hidden lg:table-cell">
                    {customer.email}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap hidden xl:table-cell">
                    {customer.startDate}
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Ellipsis className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredCustomers.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-white">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredCustomers.length)} of {filteredCustomers.length}
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

export default CustomersTable;