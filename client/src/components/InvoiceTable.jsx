import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Search, Filter, FileDown, Ellipsis, Edit, Trash2, Printer, Download, Copy, Plus, X, Eye 
} from 'lucide-react';
import InvoiceForm from './InvoiceForm';

// Initial invoices data with more realistic examples
const initialInvoicesData = [
  {
    id: 'INV-2023-001',
    date: '2023-05-01',
    account: 'Noor Textile Mills',
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
    account: 'Malik Fabrics Ltd.',
    amount: 75000,
    status: 'Pending',
    dueDate: '2023-05-25',
    items: [
      { name: 'Polyester Blend', quantity: 200, price: 375 }
    ]
  },
  {
    id: 'INV-2023-003',
    date: '2023-05-15',
    account: 'Ahmed Textiles International',
    amount: 120000,
    status: 'Overdue',
    dueDate: '2023-05-30',
    items: [
      { name: 'Woolen Cloth', quantity: 80, price: 800 },
      { name: 'Linen Fabric', quantity: 120, price: 500 }
    ]
  },
  {
    id: 'INV-2023-004',
    date: '2023-05-20',
    account: 'Zainab Cloth House & Co.',
    amount: 85000,
    status: 'Paid',
    dueDate: '2023-06-05',
    items: [
      { name: 'Chiffon Material', quantity: 150, price: 300 },
      { name: 'Georgette', quantity: 100, price: 400 }
    ]
  },
];

const STATUS_TABS = ['All', 'Paid', 'Pending', 'Overdue'];
const ITEMS_PER_PAGE_OPTIONS = [4, 10, 20, 50];
const DEFAULT_ITEMS_PER_PAGE = 10;

const InvoiceTable = () => {
  // State management
  const [invoicesData, setInvoicesData] = useState(initialInvoicesData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
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
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState(null);
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
          invoice.account.toLowerCase().includes(searchLower) ||
          invoice.date.toLowerCase().includes(searchLower) ||
          invoice.items.some(item => 
            item.name.toLowerCase().includes(searchLower)
          )
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
          (!filters.account || invoice.account.toLowerCase().includes(filters.account.toLowerCase())) &&
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
      // Custom format: e.g., Jun 28, 2025
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
  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const handleDelete = (invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.id}?`)) {
      setInvoicesData(prev => prev.filter(item => item.id !== invoice.id));
      showNotification("Invoice deleted", `Invoice ${invoice.id} has been deleted`);
    }
    setActiveDropdown(null);
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected invoices?`)) {
      setIsBulkDeleting(true);
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvoicesData(prev => prev.filter(item => !selectedRows.includes(item.id)));
      setSelectedRows([]);
      setIsBulkDeleting(false);
      
      showNotification("Bulk delete successful", `${selectedRows.length} invoices have been deleted`);
    }
  };

  const handlePrint = (invoice) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice: ${invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice { border: 1px solid #ddd; padding: 20px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .total { text-align: right; font-weight: bold; font-size: 1.1em; }
            .status { display: inline-block; padding: 2px 8px; border-radius: 12px; }
            .paid { background-color: #dcfce7; color: #166534; }
            .pending { background-color: #fef9c3; color: #854d0e; }
            .overdue { background-color: #fee2e2; color: #991b1b; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <h1>INVOICE</h1>
              <p>Invoice #: ${invoice.id}</p>
            </div>
            
            <div class="details">
              <div>
                <p><strong>Date:</strong> ${formatDate(invoice.date)}</p>
                <p><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <p><strong>Account:</strong> ${invoice.account}</p>
                <p><strong>Status:</strong> <span class="status ${invoice.status.toLowerCase()}">${invoice.status}</span></p>
              </div>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>RS ${item.price.toLocaleString()}</td>
                    <td>RS ${(item.quantity * item.price).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total">
              <p>Total Amount: RS ${invoice.amount.toLocaleString()}</p>
            </div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setActiveDropdown(null);
  };

  const handleDownload = (invoice) => {
    const data = {
      ...invoice,
      formattedDate: formatDate(invoice.date),
      formattedDueDate: formatDate(invoice.dueDate),
      formattedAmount: `RS ${invoice.amount.toLocaleString()}`
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${invoice.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification("Download started", `Invoice ${invoice.id} has been downloaded`);
    
    setActiveDropdown(null);
  };

  const handleDuplicate = (invoice) => {
    const newInvoice = {
      ...invoice,
      id: `INV-${new Date().getFullYear()}-${(invoicesData.length + 1).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending'
    };
    
    setInvoicesData(prev => [...prev, newInvoice]);
    
    showNotification("Invoice duplicated", `New invoice ${newInvoice.id} created from ${invoice.id}`);
    
    setActiveDropdown(null);
  };

  // Invoice form handlers
  const handleAddInvoice = () => setShowInvoiceForm(true);

  const handleSaveInvoice = (updatedInvoice) => {
    if (updatedInvoice.id) {
      setInvoicesData(prev =>
        prev.map(invoice => invoice.id === updatedInvoice.id ? updatedInvoice : invoice)
      );
      showNotification("Invoice updated", `Invoice ${updatedInvoice.id} has been updated`);
    } else {
      const newInvoice = {
        ...updatedInvoice,
        id: `INV-${new Date().getFullYear()}-${(invoicesData.length + 1).toString().padStart(3, '0')}`
      };
      setInvoicesData(prev => [...prev, newInvoice]);
      showNotification("Invoice created", `New invoice ${newInvoice.id} has been created`);
    }
    setShowEditModal(false);
    setEditingInvoice(null);
  };

  // View handler
  const handleView = (invoice) => {
    setViewInvoice(invoice);
    setShowViewModal(true);
    setActiveDropdown(null);
  };

  // Action dispatcher
  const handleAction = (action, invoice) => {
    const actions = {
      view: () => handleView(invoice),
      edit: () => handleEdit(invoice),
      delete: () => handleDelete(invoice),
      print: () => handlePrint(invoice),
      download: () => handleDownload(invoice),
      duplicate: () => handleDuplicate(invoice)
    };
    actions[action]?.();
  };

  // Edit Modal Component
  const EditInvoiceModal = () => {
    const [formData, setFormData] = useState(editingInvoice || {
      id: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      account: '',
      amount: 0,
      status: 'Pending',
      items: []
    });

    useEffect(() => {
      if (editingInvoice) {
        setFormData(editingInvoice);
      }
    }, []); // Removed editingInvoice from dependency array

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, field, value) => {
      const newItems = [...formData.items];
      newItems[index][field] = field === 'price' || field === 'quantity' ? Number(value) : value;
      setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addNewItem = () => {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { name: '', quantity: 1, price: 0 }]
      }));
    };

    const removeItem = (index) => {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    };

    const calculateTotal = () => {
      return formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const totalAmount = calculateTotal();
      handleSaveInvoice({ ...formData, amount: totalAmount });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-8xl max-h-[90vh] overflow-y-auto m-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {formData.id ? `Edit Invoice ${formData.id}` : 'Create New Invoice'}
            </h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice ID</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                  disabled={!!formData.id}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
                <input
                  type="text"
                  name="account"
                  value={formData.account}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Items</h3>
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-end">
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Description of Goods</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Net Weight in KG</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.netWeight || ''}
                      onChange={(e) => handleItemChange(index, 'netWeight', e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs text-gray-500 mb-1">Rate</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">V%ST</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.vat || ''}
                      onChange={(e) => handleItemChange(index, 'vat', e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Date of Sales Tax FBR</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.dateOfSalesTax || ''}
                      onChange={(e) => handleItemChange(index, 'dateOfSalesTax', e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs text-gray-500 mb-1">Amount of Additional Sales Tax</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.amountOfAdditionalSalesTax || ''}
                      onChange={(e) => handleItemChange(index, 'amountOfAdditionalSalesTax', e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs text-gray-500 mb-1">Final Amount Including Sales Tax</label>
                    <div className="p-2 text-sm">
                      RS {((Number(item.quantity) || 0) * (Number(item.price) || 0) + (Number(item.vat) || 0) + (Number(item.amountOfAdditionalSalesTax) || 0)).toLocaleString()}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addNewItem}
                className="mt-2 flex items-center text-sm text-blue-500 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="text-lg font-semibold">
                Total: RS {calculateTotal().toLocaleString()}
              </div>
              <div className="flex gap-3">
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
                  Save Invoice
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // View Modal Component
  const ViewInvoiceModal = () => {
    if (!viewInvoice) return null;
    // Example: you may want to map your invoice items to the new table structure
    const items = viewInvoice.items.map((item, idx) => ({
      no: idx + 1,
      description: item.name,
      quantity: item.quantity,
      netWeight: item.netWeight || '-', // Add netWeight to your invoice items if needed
      rate: item.price,
      vat: item.vat || 0, // Add vat to your invoice items if needed
      dateOfSalesTax: item.dateOfSalesTax || 0, // Add dateOfSalesTax to your invoice items if needed
      amountOfAdditionalSalesTax: item.amountOfAdditionalSalesTax || 0, // Add if needed
      finalAmount: (item.quantity * item.price) + (item.vat || 0) + (item.amountOfAdditionalSalesTax || 0)
    }));

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full max-w-7xl max-h-[95vh] overflow-y-auto relative">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            onClick={() => setShowViewModal(false)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Invoice #{viewInvoice.id}</h1>
              <p className="text-gray-600">Invoice Date: {formatDate(viewInvoice.date)}</p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors" onClick={() => window.print()}>
              Print
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-blue-500 rounded-lg"></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">A Rauf Brother Textile</h3>
                    <p className="text-sm text-gray-600 mb-2">Room No.205 Floor Saleha Chamber, Plot No. B-9/C-1 Site, Karachi</p>
                    <p className="text-sm text-gray-600">contact@araufbrothers.com</p>
                    <p className="text-sm text-gray-600">S. T. Reg No: 3263255606541</p>
                    <p className="text-sm text-gray-600">Telephone No: 021-36404043</p>
                    <p className="text-sm text-gray-600">NTN No: 7755266214-8</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">#{viewInvoice.date}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-4">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">PKR {viewInvoice.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-500 text-white rounded-lg p-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-blue-100 text-sm">Bill Date</p>
                      <p className="font-semibold">{formatDate(viewInvoice.date)}</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Delivery Date</p>
                      <p className="font-semibold">{formatDate(viewInvoice.dueDate)}</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Terms of Payment</p>
                      <p className="font-semibold">Within 15 days</p>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Payment Deadline</p>
                      <p className="font-semibold">{formatDate(viewInvoice.dueDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Billing Address</h4>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{viewInvoice.account}</p>
                      <p>plot no. n 29h Site, Karachi</p>
                      <p>om@om.com</p>
                      <p>S. T. Reg No: 5624660574458</p>
                      <p>Telephone No: 021-36947339</p>
                      <p>NTN No: 7755266214-9</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  Invoice not yet sent!
                </span>
              </div>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium mb-6 transition-colors">
                Send Invoice
              </button>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{viewInvoice.status}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total</span>
                      <span className="font-medium">{viewInvoice.amount.toLocaleString()} Incl. VAT</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">Deposit No. 2020-04-0006</p>
                      <p className="text-gray-600">Date: Oct 24, 2019</p>
                      <p className="text-gray-600">Amount: 300</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">Partial Payment</p>
                      <p className="text-gray-600">Date: Oct 26, 2019</p>
                      <p className="text-gray-600">Amount: 400</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">Partial Payment</p>
                      <p className="text-gray-600">Date: Oct 27, 2019</p>
                      <p className="text-gray-600">Amount: 2,230</p>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining Amount</span>
                    <span className="font-medium">100 Incl. VAT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DESCRIPTION OF GOODS</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUANTITY</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NET WEIGHT IN KG</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RATE</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">V%ST</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE OF SALES TAX FBR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT OF ADDITIONAL SALES TAX</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FINAL AMOUNT INCLUDING SALES TAX</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.no}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.netWeight}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.rate}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.vat}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.dateOfSalesTax}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.amountOfAdditionalSalesTax}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.finalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-4 py-6 border-t border-gray-200">
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total HT</span>
                    <span className="font-medium">{viewInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rate</span>
                    <span className="font-medium">{items.length > 0 ? items[0].rate : '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total VAT</span>
                    <span className="font-medium">{items.reduce((sum, i) => sum + (i.vat || 0), 0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                    <span>Total Price</span>
                    <span>{viewInvoice.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-4 border-t border-gray-200 text-sm text-gray-600">
              <h4 className="font-semibold mb-2">Terms & Conditions</h4>
              <p>Please pay within 15 days of receiving this invoice.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <div className="font-bold">{notification.title}</div>
          <div>{notification.description}</div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Invoices</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage your billing and invoices efficiently
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="pl-10 pr-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleAddInvoice}
              className="flex items-center gap-1 bg-[#1976D2] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Invoice</span>
            </button>

            <button 
              className={`flex items-center gap-1 border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm transition-colors ${
                showFilters ? 'bg-gray-100 border-gray-300' : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Filter</span>
            </button>

            <div className="relative">
              <button className="flex items-center gap-1 bg-white border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-gray-50">
                <FileDown className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md flex justify-between items-center">
          <div className="text-sm text-blue-800">
            {selectedRows.length} invoice(s) selected
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-xs hover:bg-red-100 disabled:opacity-50"
            >
              {isBulkDeleting ? (
                'Deleting...'
              ) : (
                <>
                  <Trash2 className="w-3 h-3" />
                  <span>Delete Selected</span>
                </>
              )}
            </button>
          </div>
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
            <div className="flex gap-2">
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-xs"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="overflow-x-auto mb-4">
        <div className="flex border-b w-max min-w-full">
          {STATUS_TABS.map(status => (
            <button
              key={status}
              className={`px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 ${
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
        <div className="relative min-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-center text-xs sm:text-sm font-normal text-black">
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
                <th className="pb-3 px-2 whitespace-nowrap text-left">Account</th>
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
                      <div className="line-clamp-1">{invoice.account}</div>
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
                                onClick={() => handleAction('view', invoice)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </button>
                              <button
                                onClick={() => handleAction('edit', invoice)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleAction('print', invoice)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                              </button>
                              <button
                                onClick={() => handleAction('download', invoice)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </button>
                              <button
                                onClick={() => handleAction('duplicate', invoice)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </button>
                              <div className="border-t border-gray-200"></div>
                              <button
                                onClick={() => handleAction('delete', invoice)}
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
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-1 flex items-center">...</span>
            )}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`px-3 py-1 text-sm rounded-md min-w-[36px] ${
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
      {showEditModal && <EditInvoiceModal />}

      {/* Invoice Form Modal */}
      {showInvoiceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
          <div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl sm:max-w-2xl p-0 overflow-hidden flex flex-col"
            style={{ maxWidth: 700, maxHeight: '90vh' }}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
              onClick={() => setShowInvoiceForm(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="px-8 pt-8 pb-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Create Invoice</h2>
              <p className="text-sm text-gray-500">Fill in the invoice details below.</p>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <InvoiceForm
                onSubmit={(data) => {
                  const uniqueId = `INV-${new Date().getFullYear()}-${(invoicesData.length + 1).toString().padStart(3, '0')}`;
                  const date = data.billDate || new Date().toISOString().split('T')[0];
                  const dueDate = data.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                  
                  setInvoicesData(prev => [
                    ...prev,
                    {
                      id: uniqueId,
                      date,
                      dueDate,
                      account: data.customerName,
                      amount: Number(data.totalAmount) || 0,
                      status: 'Pending',
                      items: data.items || []
                    }
                  ]);
                  
                  showNotification("Invoice created", `Invoice ${uniqueId} has been created`);
                  
                  setShowInvoiceForm(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {showViewModal && <ViewInvoiceModal />}
    </div>
  );
};

export default InvoiceTable;