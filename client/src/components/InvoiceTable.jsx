import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, Filter, Ellipsis, Edit, Trash2, Plus, Loader, Eye, Copy, 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

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
    customer_name: "",
    customer_email: "",
    p_number: "",
    a_p_number: "",
    address: "",
    st_reg_no: "",
    ntn_number: "",
    item_name: "",
    quantity: "",
    rate: "",
    currency: "PKR",
    salesTax: "",
    item_amount: "",
    tax_amount: "",
    total_amount: "",
    bill_date: new Date().toISOString().split('T')[0],
    payment_deadline: "",
    Note: "",
    status: "Pending"
  });

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        customer_name: initialData.customer_name || "",
        customer_email: initialData.customer_email || "",
        p_number: initialData.p_number || "",
        a_p_number: initialData.a_p_number || "",
        address: initialData.address || "",
        st_reg_no: initialData.st_reg_no || "",
        ntn_number: initialData.ntn_number || "",
        item_name: initialData.item_name || "",
        quantity: initialData.quantity?.toString() || "",
        rate: initialData.rate?.toString() || "",
        currency: initialData.currency || "PKR",
        salesTax: initialData.salesTax || "",
        item_amount: initialData.item_amount?.toString() || "",
        tax_amount: initialData.tax_amount?.toString() || "",
        total_amount: initialData.total_amount?.toString() || "",
        bill_date: initialData.bill_date || new Date().toISOString().split('T')[0],
        payment_deadline: initialData.payment_deadline || "",
        Note: initialData.Note || "",
        status: initialData.status || "Pending"
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
    if (!formData.customer_name || !formData.customer_email) {
      alert("Please fill in required fields.");
      return;
    }

    // Prepare data for API
    const invoiceData = {
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      p_number: formData.p_number,
      a_p_number: formData.a_p_number,
      address: formData.address,
      st_reg_no: formData.st_reg_no,
      ntn_number: formData.ntn_number,
      item_name: formData.item_name,
      quantity: parseFloat(formData.quantity) || 0,
      rate: parseFloat(formData.rate) || 0,
      currency: formData.currency,
      salesTax: parseFloat(formData.salesTax) || 0,
      item_amount: parseFloat(formData.item_amount) || 0,
      tax_amount: parseFloat(formData.tax_amount) || 0,
      total_amount: parseFloat(formData.total_amount) || 0,
      bill_date: formData.bill_date,
      payment_deadline: formData.payment_deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      Note: formData.Note,
      status: formData.status
    };

    onSubmit(invoiceData);
  };

  // Calculate item_amount, tax_amount, and total_amount
  useEffect(() => {
    const quantity = parseFloat(formData.quantity) || 0;
    const rate = parseFloat(formData.rate) || 0;
    const tax = parseFloat(formData.salesTax) || 0;

    const item_amount = quantity * rate;
    const tax_amount = item_amount * (tax / 100);
    const total_amount = item_amount + tax_amount;

    setFormData((prev) => ({
      ...prev,
      item_amount: item_amount ? item_amount.toFixed(2) : "",
      tax_amount: item_amount ? tax_amount.toFixed(2) : "",
      total_amount: item_amount ? total_amount.toFixed(2) : "",
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
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
            />
            <Input
              label="Customer Email *"
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone Number"
              name="p_number"
              value={formData.p_number}
              onChange={handleChange}
            />
            <Input
              label="Alternate Phone"
              name="a_p_number"
              value={formData.a_p_number}
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
              name="st_reg_no"
              value={formData.st_reg_no}
              onChange={handleChange}
            />
            <Input
              label="NTN Number"
              name="ntn_number"
              value={formData.ntn_number}
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
              name="item_name"
              value={formData.item_name}
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
              name="item_amount"
              value={formData.item_amount}
              readOnly
              className="bg-blue-50 border-blue-200 font-medium"
            />

            <Input
              label="Tax Amount"
              type="number"
              name="tax_amount"
              value={formData.tax_amount}
              readOnly
              className="bg-blue-50 border-blue-200 font-medium"
            />

            <Input
              label="Total Amount"
              type="number"
              name="total_amount"
              value={formData.total_amount}
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
              name="bill_date"
              value={formData.bill_date}
              onChange={handleChange}
            />
            <Input
              label="Payment Deadline"
              type="date"
              name="payment_deadline"
              value={formData.payment_deadline}
              onChange={handleChange}
            />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Note
            </label>
            <textarea
              name="Note"
              rows={4}
              value={formData.Note}
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
  const navigate = useNavigate();
  
  // State management
  const [invoicesData, setInvoicesData] = useState([]);
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
  const [loading, setLoading] = useState(true);
  const dropdownRefs = useRef([]);

  // Fetch invoices from API
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/invoices`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      const data = await response.json();
      setInvoicesData(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      showNotification("Error", "Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

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
          invoice.id.toString().toLowerCase().includes(searchLower) ||
          invoice.customer_name.toLowerCase().includes(searchLower) ||
          invoice.bill_date.toLowerCase().includes(searchLower)
        );
      })
      .filter(invoice => 
        activeTab === 'All' || invoice.status === activeTab
      )
      .filter(invoice => {
        const invoiceDate = new Date(invoice.bill_date);
        return (
          (!filters.minAmount || invoice.total_amount >= Number(filters.minAmount)) &&
          (!filters.maxAmount || invoice.total_amount <= Number(filters.maxAmount)) &&
          (!filters.dateFrom || invoiceDate >= new Date(filters.dateFrom)) &&
          (!filters.dateTo || invoiceDate <= new Date(filters.dateTo)) &&
          (!filters.account || invoice.customer_name.toLowerCase().includes(filters.account.toLowerCase())) &&
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

  const handleViewInvoice = (invoice) => {
    navigate(`/invoices/${invoice.id}`);
    setActiveDropdown(null);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceForm(true);
    setActiveDropdown(null);
  };

  const handleDuplicateInvoice = async (invoice) => {
    try {
      // Create a copy of the invoice with a new ID
      const duplicatedInvoice = {
        ...invoice,
        id: null, // Let the server generate a new ID
        bill_date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };
      
      delete duplicatedInvoice.id; // Remove the ID so the server creates a new one
      
      const response = await fetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(duplicatedInvoice)
      });
      
      if (!response.ok) {
        throw new Error('Failed to duplicate invoice');
      }
      
      // Refresh the invoice list
      await fetchInvoices();
      
      showNotification("Invoice duplicated", "Invoice has been duplicated successfully");
    } catch (error) {
      console.error('Error duplicating invoice:', error);
      showNotification("Error", "Failed to duplicate invoice");
    }
    
    setActiveDropdown(null);
  };

  const handleDeleteInvoice = async (invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.id}?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/invoices/${invoice.id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete invoice');
        }
        
        setInvoicesData(prev => prev.filter(item => item.id !== invoice.id));
        showNotification("Invoice deleted", `Invoice ${invoice.id} has been deleted`);
      } catch (error) {
        console.error('Error deleting invoice:', error);
        showNotification("Error", "Failed to delete invoice");
      }
    }
    setActiveDropdown(null);
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected invoices?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/invoices/bulk-delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ids: selectedRows })
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete invoices');
        }
        
        setInvoicesData(prev => prev.filter(item => !selectedRows.includes(item.id)));
        setSelectedRows([]);
        showNotification("Bulk delete successful", `${selectedRows.length} invoices have been deleted`);
      } catch (error) {
        console.error('Error deleting invoices:', error);
        showNotification("Error", "Failed to delete invoices");
      }
    }
  };

  // Form handlers
  const handleFormSubmit = async (invoiceData) => {
    try {
      let response;
      
      if (editingInvoice) {
        // Update existing invoice
        response = await fetch(`${API_BASE_URL}/invoices/${editingInvoice.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(invoiceData)
        });
      } else {
        // Create new invoice
        response = await fetch(`${API_BASE_URL}/invoices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(invoiceData)
        });
      }
      
      if (!response.ok) {
        throw new Error(`Failed to ${editingInvoice ? 'update' : 'create'} invoice`);
      }
      
      // Refresh the invoice list
      await fetchInvoices();
      
      showNotification(
        `Invoice ${editingInvoice ? 'updated' : 'created'}`,
        `Invoice has been ${editingInvoice ? 'updated' : 'created'} successfully`
      );
    } catch (error) {
      console.error('Error saving invoice:', error);
      showNotification("Error", `Failed to ${editingInvoice ? 'update' : 'create'} invoice`);
    }
    
    setShowInvoiceForm(false);
    setEditingInvoice(null);
  };

  const handleFormCancel = () => {
    setShowInvoiceForm(false);
    setEditingInvoice(null);
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader className="w-8 h-8 animate-spin text-blue-500 mb-2" />
          <div className="text-gray-500">Loading invoices...</div>
        </div>
      </div>
    );
  }

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
                  {[4, 10, 20, 50].map(option => (
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
            {['All', 'Paid', 'Pending', 'Overdue'].map(status => (
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
                        <span>INV-{invoice.id}</span>
                        <span className="text-xs text-gray-500">
                          Due: {formatDate(invoice.payment_deadline)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(invoice.bill_date)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      <div className="line-clamp-1">{invoice.customer_name}</div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap text-right">
                      {invoice.currency} {invoice.total_amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusClass(invoice.status)}`}>
                        {invoice.status || 'Pending'}
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
                                onClick={() => handleViewInvoice(invoice)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </button>
                              <button
                                onClick={() => handleEditInvoice(invoice)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDuplicateInvoice(invoice)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
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

export default InvoiceManagement;