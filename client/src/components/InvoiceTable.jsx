import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, Filter, Ellipsis, Edit, Trash2, Plus
} from 'lucide-react';

// Initial invoices data
const initialInvoicesData = [
  {
    id: 'INV-2023-001',
    date: '2023-05-01',
    customerName: 'Noor Textile Mills',
    customerEmail: 'contact@noortextile.com',
    phone: '021-12345678',
    address: 'Plot No. A-1, Industrial Area, Karachi',
    amount: 90000,
    status: 'Paid',
    dueDate: '2023-05-15',
    items: [
      { name: 'Cotton Fabric', quantity: 100, price: 500 },
      { name: 'Silk Material', quantity: 50, price: 800 }
    ]
  },
  {
    id: 'INV-2023-002',
    date: '2023-05-10',
    customerName: 'Malik Fabrics Ltd.',
    customerEmail: 'info@malikfabrics.com',
    phone: '021-87654321',
    address: 'Shop No. 25, Textile Market, Lahore',
    amount: 75000,
    status: 'Pending',
    dueDate: '2023-05-25',
    items: [
      { name: 'Polyester Blend', quantity: 200, price: 375 }
    ]
  }
];

const STATUS_TABS = ['All', 'Paid', 'Pending', 'Overdue'];
const ITEMS_PER_PAGE_OPTIONS = [4, 10, 20, 50];

// Reusable Input Component
const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  readOnly = false,
  className = "",
  ...props
}) => (
  <div className={`flex flex-col ${className}`}>
    <label className="text-sm font-semibold text-gray-700 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
      className={`rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition ${
        readOnly ? "bg-gray-50" : ""
      }`}
      {...props}
    />
  </div>
);

// Invoice Form Component
const InvoiceForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    phone: "",
    a_p_Name: "",
    address: "",
    stRegNo: "",
    ntnNumber: "",
    itemName: "",
    quantity: "",
    rate: "",
    currency: "PKR",
    salesTax: "",
    itemAmount: "",
    totalAmount: "",
    taxAmount: "",
    billDate: new Date().toISOString().split('T')[0],
    paymentDeadline: "",
    note: "",
  });

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        customerName: initialData.customerName || "",
        customerEmail: initialData.customerEmail || "",
        phone: initialData.phone || "",
        a_p_Name: initialData.a_p_Name || "",
        address: initialData.address || "",
        stRegNo: initialData.stRegNo || "",
        ntnNumber: initialData.ntnNumber || "",
        itemName: initialData.items?.[0]?.name || "",
        quantity: initialData.items?.[0]?.quantity?.toString() || "",
        rate: initialData.items?.[0]?.price?.toString() || "",
        currency: initialData.currency || "PKR",
        salesTax: initialData.salesTax || "",
        itemAmount: "",
        totalAmount: initialData.amount?.toString() || "",
        taxAmount: "",
        billDate: initialData.date || new Date().toISOString().split('T')[0],
        paymentDeadline: initialData.dueDate || "",
        note: initialData.note || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCurrencyChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      currency: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail) {
      alert("Please fill in required fields.");
      return;
    }

    // Create invoice object
    const invoiceData = {
      id: initialData?.id || null, // null for new invoices
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      phone: formData.phone,
      address: formData.address,
      date: formData.billDate,
      dueDate: formData.paymentDeadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: parseFloat(formData.totalAmount) || 0,
      status: initialData?.status || 'Pending',
      currency: formData.currency,
      salesTax: formData.salesTax,
      note: formData.note,
      items: [{
        name: formData.itemName,
        quantity: parseFloat(formData.quantity) || 0,
        price: parseFloat(formData.rate) || 0
      }]
    };

    onSubmit(invoiceData);
  };

  // Calculate itemAmount, taxAmount, and totalAmount
  useEffect(() => {
    const quantity = parseFloat(formData.quantity) || 0;
    const rate = parseFloat(formData.rate) || 0;
    const tax = parseFloat(formData.salesTax) || 0;

    const itemAmount = quantity * rate;
    const taxAmount = itemAmount * (tax / 100);
    const totalAmount = itemAmount + taxAmount;

    setFormData((prev) => ({
      ...prev,
      itemAmount: itemAmount ? itemAmount.toFixed(2) : "",
      taxAmount: itemAmount ? taxAmount.toFixed(2) : "",
      totalAmount: itemAmount ? totalAmount.toFixed(2) : "",
    }));
  }, [formData.quantity, formData.rate, formData.salesTax]);

  return (
    <div className="max-w-5xl mx-auto bg-white">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer Information */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Customer Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Customer Name *"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
            <Input
              label="Customer Email *"
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <Input
              label="Alternate Phone"
              name="a_p_Name"
              value={formData.a_p_Name}
              onChange={handleChange}
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <Input
              label="S.T Reg No"
              name="stRegNo"
              value={formData.stRegNo}
              onChange={handleChange}
            />
            <Input
              label="NTN Number"
              name="ntnNumber"
              value={formData.ntnNumber}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Item Details */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Item Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Item Name"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
            />

            <Input
              label="Quantity *"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
            <Input
              label="Rate *"
              type="number"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Currency
              </label>
              <select
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                value={formData.currency}
                onChange={handleCurrencyChange}
              >
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <Input
              label="Sales Tax (%) *"
              type="number"
              name="salesTax"
              value={formData.salesTax}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />

            <Input
              label="Item Amount"
              type="number"
              name="itemAmount"
              value={formData.itemAmount}
              readOnly
              className="bg-blue-50 border-blue-200 font-medium"
            />

            <Input
              label="Tax Amount"
              type="number"
              name="taxAmount"
              value={formData.taxAmount}
              readOnly
              className="bg-blue-50 border-blue-200 font-medium"
            />

            <Input
              label="Total Amount"
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              readOnly
              className="bg-blue-50 border-blue-200 font-medium"
            />
          </div>
        </section>

        {/* Dates and Note */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Invoice Info
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Bill Date"
              type="date"
              name="billDate"
              value={formData.billDate}
              onChange={handleChange}
            />
            <Input
              label="Payment Deadline"
              type="date"
              name="paymentDeadline"
              value={formData.paymentDeadline}
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Note
            </label>
            <textarea
              name="note"
              rows={4}
              value={formData.note}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-3 bg-white shadow-sm focus:ring-2 focus:ring-blue-200 outline-none transition"
              placeholder="Enter a message for the customer..."
            ></textarea>
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-8 py-2 rounded-xl transition duration-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-xl transition duration-300"
          >
            {initialData ? 'Update Invoice' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Invoice Management Component
const InvoiceManagement = () => {
  // State management
  const [invoicesData, setInvoicesData] = useState(initialInvoicesData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [filters, setFilters] = useState({
    minAmount: '',
    maxAmount: '',
    dateFrom: '',
    dateTo: '',
    account: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [notification, setNotification] = useState(null);
  const dropdownRefs = useRef([]);

  // Show notification
  const showNotification = (title, description, duration = 3000) => {
    setNotification({ title, description });
    setTimeout(() => setNotification(null), duration);
  };

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

  // Filter invoices based on search, tabs, and filters
  const filteredInvoices = useCallback(() => {
    return invoicesData
      .filter(invoice => {
        const searchLower = searchTerm.toLowerCase();
        return (
          invoice.id.toLowerCase().includes(searchLower) ||
          invoice.customerName.toLowerCase().includes(searchLower) ||
          invoice.date.toLowerCase().includes(searchLower)
        );
      })
      .filter(invoice => 
        activeTab === 'All' || invoice.status === activeTab
      )
      .filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        return (
          (!filters.minAmount || invoice.amount >= Number(filters.minAmount)) &&
          (!filters.maxAmount || invoice.amount <= Number(filters.maxAmount)) &&
          (!filters.dateFrom || invoiceDate >= new Date(filters.dateFrom)) &&
          (!filters.dateTo || invoiceDate <= new Date(filters.dateTo)) &&
          (!filters.account || invoice.customerName.toLowerCase().includes(filters.account.toLowerCase())) &&
          (!filters.status || invoice.status === filters.status)
        );
      });
  }, [invoicesData, searchTerm, activeTab, filters]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredInvoices().length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleInvoices = filteredInvoices().slice(startIndex, startIndex + itemsPerPage);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return dateString;
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    } catch {
      return dateString;
    }
  };

  // Selection handlers
  const toggleSelectAll = () => {
    setSelectedRows(prev =>
      prev.length === visibleInvoices.length ? [] : visibleInvoices.map(invoice => invoice.id)
    );
  };

  const toggleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  // Pagination handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedRows([]);
    }
  };

  // Filter handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      minAmount: '',
      maxAmount: '',
      dateFrom: '',
      dateTo: '',
      account: '',
      status: ''
    });
    setSearchTerm('');
    setActiveTab('All');
    setCurrentPage(1);
    showNotification("Filters reset", "All filters have been cleared");
  };

  // UI helpers
  const getStatusClass = (status) => {
    const statusClasses = {
      'Paid': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Overdue': 'bg-red-100 text-red-800',
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  const toggleDropdown = (invoiceId, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === invoiceId ? null : invoiceId);
  };

  // Invoice actions
  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setShowInvoiceForm(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceForm(true);
    setActiveDropdown(null);
  };

  const handleDeleteInvoice = (invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.id}?`)) {
      setInvoicesData(prev => prev.filter(item => item.id !== invoice.id));
      showNotification("Invoice deleted", `Invoice ${invoice.id} has been deleted`);
    }
    setActiveDropdown(null);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected invoices?`)) {
      setInvoicesData(prev => prev.filter(item => !selectedRows.includes(item.id)));
      setSelectedRows([]);
      showNotification("Bulk delete successful", `${selectedRows.length} invoices have been deleted`);
    }
  };

  // Form handlers
  const handleFormSubmit = (invoiceData) => {
    if (invoiceData.id) {
      // Update existing invoice
      setInvoicesData(prev =>
        prev.map(invoice => invoice.id === invoiceData.id ? invoiceData : invoice)
      );
      showNotification("Invoice updated", `Invoice ${invoiceData.id} has been updated`);
    } else {
      // Create new invoice
      const newInvoice = {
        ...invoiceData,
        id: `INV-${new Date().getFullYear()}-${(invoicesData.length + 1).toString().padStart(3, '0')}`
      };
      setInvoicesData(prev => [...prev, newInvoice]);
      showNotification("Invoice created", `New invoice ${newInvoice.id} has been created`);
    }
    setShowInvoiceForm(false);
    setEditingInvoice(null);
  };

  const handleFormCancel = () => {
    setShowInvoiceForm(false);
    setEditingInvoice(null);
  };

  return (
    <div className="p-4">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <div className="font-bold">{notification.title}</div>
          <div>{notification.description}</div>
        </div>
      )}

      {/* Invoice Form Modal */}
      {showInvoiceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingInvoice ? `Edit Invoice ${editingInvoice.id}` : 'Create New Invoice'}
              </h2>
            </div>
            <InvoiceForm
              initialData={editingInvoice}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {/* Main Invoice Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <div>
            <h2 className="text-xl font-semibold">Invoices</h2>
            <p className="text-sm text-gray-500">
              Manage your billing and invoices efficiently
            </p>
          </div>
          
          <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search invoices..."
                className="pl-10 pr-3 py-2 border rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleCreateInvoice}
                className="flex items-center gap-1 bg-[#1976D2] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Invoice
              </button>

              <button 
                className={`flex items-center gap-1 border rounded-md px-3 py-2 text-sm transition-colors ${
                  showFilters ? 'bg-gray-100 border-gray-300' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md flex justify-between items-center">
            <div className="text-sm text-blue-800">
              {selectedRows.length} invoice(s) selected
            </div>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-xs hover:bg-red-100"
            >
              <Trash2 className="w-3 h-3" />
              Delete Selected
            </button>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min Amount</label>
              <input
                type="number"
                name="minAmount"
                placeholder="RS 0"
                className="w-full p-2 border rounded-md text-xs"
                value={filters.minAmount}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max Amount</label>
              <input
                type="number"
                name="maxAmount"
                placeholder="RS 0"
                className="w-full p-2 border rounded-md text-xs"
                value={filters.maxAmount}
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
              <label className="block text-xs font-medium text-gray-700 mb-1">Account</label>
              <input
                type="text"
                name="account"
                className="w-full p-2 border rounded-md text-xs"
                value={filters.account}
                onChange={handleFilterChange}
                placeholder="Filter by account"
              />
            </div>
            <div className="md:col-span-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-700">Items per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="p-1 border rounded text-xs"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-xs"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="overflow-x-auto mb-4">
          <div className="flex border-b w-max min-w-full">
            {STATUS_TABS.map(status => (
              <button
                key={status}
                className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 ${
                  activeTab === status
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => {
                  setActiveTab(status);
                  setCurrentPage(1);
                }}
              >
                {status} {status !== 'All' && `(${filteredInvoices().filter(i => i.status === status).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr className="text-center text-sm font-normal text-black">
                <th className="pb-3 px-2 whitespace-nowrap w-10">
                  <input
                    type="checkbox"
                    checked={visibleInvoices.length > 0 && selectedRows.length === visibleInvoices.length}
                    onChange={toggleSelectAll}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                </th>
                <th className="pb-3 px-2 whitespace-nowrap text-left">Invoice ID</th>
                <th className="pb-3 px-2 whitespace-nowrap text-left">Billing Date</th>
                <th className="pb-3 px-2 whitespace-nowrap text-left">Customer</th>
                <th className="pb-3 px-2 whitespace-nowrap text-right">Amount</th>
                <th className="pb-3 px-2 whitespace-nowrap">Status</th>
                <th className="pb-3 px-2 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleInvoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 text-gray-300 mb-2" />
                      No invoices found matching your criteria
                      {searchTerm || Object.values(filters).some(Boolean) ? (
                        <button
                          onClick={resetFilters}
                          className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Clear filters
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ) : (
                visibleInvoices.map((invoice, index) => (
                  <tr 
                    key={invoice.id} 
                    className={`hover:bg-gray-50 ${selectedRows.includes(invoice.id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(invoice.id)}
                        onChange={() => toggleSelectRow(invoice.id)}
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{invoice.id}</span>
                        <span className="text-xs text-gray-500">
                          Due: {formatDate(invoice.dueDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="line-clamp-1">{invoice.customerName}</div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap text-right">
                      RS {invoice.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusClass(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap relative">
                      <div className="flex justify-center">
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => toggleDropdown(invoice.id, e)}
                          aria-label="Invoice actions"
                        >
                          <Ellipsis className="h-5 w-5" />
                        </button>
                        
                        {activeDropdown === invoice.id && (
                          <div 
                            ref={el => dropdownRefs.current[index] = el}
                            className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleEditInvoice(invoice)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteInvoice(invoice)}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-white gap-3">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredInvoices().length)} of {filteredInvoices().length} invoices
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
                    className={`px-3 py-1 text-sm rounded-md min-w-[36px] ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    } border`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
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
    </div>
  );
};

export default InvoiceManagement