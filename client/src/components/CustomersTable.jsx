import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, FileDown, Ellipsis, Edit, Trash2, Printer, Download, Copy, Plus } from 'lucide-react';

// Initial customers data
const initialCustomersData = [
  {
    id: '1',
    name: 'Noor Textile',
    date: 'Feb 08, 2025',
    phoneNumber: '0231153636',
    price: 90000,
    category: 'Dying',
    address: 'Karachi',
    email: 'Noor@gmail.com',
    startDate: 'Feb 08, 2025',
  },
  {
    id: '2',
    name: 'Malik Fabrics',
    date: 'Mar 15, 2025',
    phoneNumber: '0231156789',
    price: 75000,
    category: 'Weaving',
    address: 'Lahore',
    email: 'malik@gmail.com',
    startDate: 'Mar 10, 2025',
  },
  {
    id: '3',
    name: 'Ahmed Textiles',
    date: 'Apr 22, 2025',
    phoneNumber: '0233456789',
    price: 120000,
    category: 'Dying',
    address: 'Islamabad',
    email: 'ahmed@gmail.com',
    startDate: 'Apr 15, 2025',
  },
  {
    id: '4',
    name: 'Zainab Cloth House',
    date: 'May 05, 2025',
    phoneNumber: '0235678901',
    price: 85000,
    category: 'Stitching',
    address: 'Faisalabad',
    email: 'zainab@gmail.com',
    startDate: 'May 01, 2025',
  },
];

const ITEMS_PER_PAGE = 4;

const CustomersTable = () => {
  const [customersData, setCustomersData] = useState(initialCustomersData);
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
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const dropdownRef = useRef(null);

  const customerCategories = ['All', 'Dying', 'Weaving', 'Stitching'];

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

  const toggleDropdown = (customerId, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === customerId ? null : customerId);
  };

  // Action functions
  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const handleDelete = (customer) => {
    if (window.confirm(`Are you sure you want to delete customer "${customer.name}"?`)) {
      setCustomersData(prev => prev.filter(item => item.id !== customer.id));
    }
    setActiveDropdown(null);
  };

  const handlePrint = (customer) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Customer Details: ${customer.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            .receipt { border: 1px solid #ddd; padding: 20px; max-width: 500px; margin: 0 auto; }
            .row { display: flex; margin-bottom: 10px; }
            .label { font-weight: bold; width: 150px; }
            .value { flex: 1; }
          </style>
        </head>
        <body>
          <h1>Customer Details</h1>
          <div class="receipt">
            <div class="row"><div class="label">Name:</div><div class="value">${customer.name}</div></div>
            <div class="row"><div class="label">Date:</div><div class="value">${customer.date}</div></div>
            <div class="row"><div class="label">Phone:</div><div class="value">${customer.phoneNumber}</div></div>
            <div class="row"><div class="label">Price:</div><div class="value">PKR ${customer.price.toLocaleString()}</div></div>
            <div class="row"><div class="label">Category:</div><div class="value">${customer.category}</div></div>
            <div class="row"><div class="label">Address:</div><div class="value">${customer.address}</div></div>
            <div class="row"><div class="label">Email:</div><div class="value">${customer.email}</div></div>
            <div class="row"><div class="label">Start Date:</div><div class="value">${customer.startDate}</div></div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setActiveDropdown(null);
  };

  const handleDownload = (customer) => {
    const data = {
      name: customer.name,
      date: customer.date,
      phoneNumber: customer.phoneNumber,
      price: `PKR ${customer.price.toLocaleString()}`,
      category: customer.category,
      address: customer.address,
      email: customer.email,
      startDate: customer.startDate
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer_${customer.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setActiveDropdown(null);
  };

  const handleDuplicate = (customer) => {
    const newCustomer = {
      ...customer,
      id: Date.now().toString(),
      name: `${customer.name} (Copy)`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };
    
    setCustomersData(prev => [...prev, newCustomer]);
    setActiveDropdown(null);
  };

  const handleAddCustomer = () => {
    const newCustomer = {
      id: Date.now().toString(),
      name: 'New Customer',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      phoneNumber: '',
      price: 0,
      category: 'Dying',
      address: '',
      email: '',
      startDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };
    
    setEditingCustomer(newCustomer);
    setShowEditModal(true);
  };

  const handleSaveCustomer = (updatedCustomer) => {
    if (updatedCustomer.id) {
      // Update existing customer
      setCustomersData(prev =>
        prev.map(customer =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        )
      );
    } else {
      // Add new customer
      setCustomersData(prev => [...prev, updatedCustomer]);
    }
    setShowEditModal(false);
    setEditingCustomer(null);
  };

  const handleAction = (action, customer) => {
    switch (action) {
      case 'edit':
        handleEdit(customer);
        break;
      case 'delete':
        handleDelete(customer);
        break;
      case 'print':
        handlePrint(customer);
        break;
      case 'download':
        handleDownload(customer);
        break;
      case 'duplicate':
        handleDuplicate(customer);
        break;
      default:
        break;
    }
  };

  // Edit Modal Component
  const EditCustomerModal = () => {
    const [formData, setFormData] = useState(editingCustomer);
    
    useEffect(() => {
      setFormData(editingCustomer);
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
      handleSaveCustomer(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">
            {formData.id ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                {customerCategories.filter(cat => cat !== 'All').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
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
            <button 
              className="flex items-center gap-1 bg-[#1976D2] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors"
              onClick={handleAddCustomer}
            >
              <Plus className="w-4 h-4" />
              <span>Add New Customer</span>
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
            <tbody className="text-center divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-4 text-center text-sm text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                visibleCustomers.map((customer) => (
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
                    <td className="px-4 py-4 text-sm whitespace-nowrap relative">
                      <div className="flex justify-center">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => toggleDropdown(customer.id, e)}
                        >
                          <Ellipsis className="h-5 w-5" />
                        </button>
                        
                        {activeDropdown === customer.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleAction('edit', customer)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleAction('delete', customer)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                              <button
                                onClick={() => handleAction('print', customer)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                              </button>
                              <button
                                onClick={() => handleAction('download', customer)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </button>
                              <button
                                onClick={() => handleAction('duplicate', customer)}
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
      {filteredCustomers.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-white gap-3">
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

      {/* Edit Modal */}
      {showEditModal && <EditCustomerModal />}
    </div>
  );
};

export default CustomersTable;