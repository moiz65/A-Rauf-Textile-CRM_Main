import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, FileDown, Ellipsis, Edit, Trash2, Printer, Download, Plus } from 'lucide-react';
import SimpleCategoryStats from './SimpleCategoryStats';
import CategoryAutocomplete from './CategoryAutocomplete';
import { useClickOutside } from '../hooks/useClickOutside';

const ITEMS_PER_PAGE = 5;

const ExpenseTable = () => {
  const [expensesData, setExpensesData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [filters, setFilters] = useState({
    title: '',
    vendor: '',
    minAmount: '',
    maxAmount: '',
    dateFrom: '',
    dateTo: '',
    category: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const dropdownRef = useRef(null);
  const filterPanelRef = useRef(null);

  // Add click outside handler for edit modal
  const editModalRef = useClickOutside(() => {
    if (showEditModal) {
      setShowEditModal(false);
      setEditingExpense(null);
    }
  }, showEditModal);

  // Tab categories - only 4 main types
  const tabCategories = ['All', 'Expense', 'Income', 'Asset', 'Liability'];
  const statusOptions = ['All', 'Paid', 'Pending'];
  const paymentMethods = ['Bank Transfer', 'Cash', 'Credit Card', 'Check', 'Online Payment'];

  // Fetch expenses data from API
  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/expenses');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setExpensesData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to fetch expenses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('http://localhost:5000/api/categories');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      const activeCategories = result.data.filter(cat => cat.status === 'Active' && cat.name !== 'All');
      setAllCategories(activeCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setAllCategories([]); // Fallback
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ignore clicks inside the filter panel so inputs keep focus
      if (filterPanelRef.current && filterPanelRef.current.contains(event.target)) return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper function to get category type from category name
  const getCategoryType = (categoryName) => {
    const categoryData = allCategories.find(cat => cat.name === categoryName);
    return categoryData ? categoryData.type : 'Expense'; // Default to 'Expense' if not found
  };

  const filteredExpenses = expensesData
    .filter(expense =>
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(expense => {
      if (activeTab === 'All') return true;
      const categoryType = getCategoryType(expense.category);
      return categoryType === activeTab;
    })
    .filter(expense =>
      (!filters.title || expense.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (!filters.vendor || expense.vendor.toLowerCase().includes(filters.vendor.toLowerCase())) &&
      (!filters.minAmount || expense.amount >= Number(filters.minAmount)) &&
      (!filters.maxAmount || expense.amount <= Number(filters.maxAmount)) &&
      (!filters.dateFrom || new Date(expense.date) >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || new Date(expense.date) <= new Date(filters.dateTo)) &&
      (!filters.category || expense.category === filters.category) &&
      (!filters.status || expense.status === filters.status)
    );

  const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleExpenses = filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Compute pages to display in pagination (max 5 visible pages, with ellipses)
  const maxVisiblePages = 5;
  const pages = [];
  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    const half = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - half);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = endPage - maxVisiblePages + 1;
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
  }

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
    // Get the category type to determine color
    const categoryType = getCategoryType(category);
    switch(categoryType) {
      case 'Expense': return 'bg-red-100 text-red-800';
      case 'Income': return 'bg-green-100 text-green-800';
      case 'Asset': return 'bg-blue-100 text-blue-800';
      case 'Liability': return 'bg-yellow-100 text-yellow-800';
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
      minAmount: '',
      maxAmount: '',
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

  // Action functions with API calls
  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const handleDelete = async (expense) => {
    if (window.confirm(`Are you sure you want to delete expense "${expense.title}"?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/expenses/${expense.id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete expense');
        }

        // Refresh the data after successful deletion
        await fetchExpenses();
      } catch (err) {
        console.error('Error deleting expense:', err);
        alert('Failed to delete expense. Please try again.');
      }
    }
    setActiveDropdown(null);
  };




  const handleAddExpense = () => {
    const newExpense = {
      title: 'New Expense',
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      amount: 0,
      category: '',
      categoryType: 'Expense',
      paymentMethod: 'Cash',
      description: '',
      status: 'Pending'
    };
    
    setEditingExpense(newExpense);
    setShowEditModal(true);
  };

  const handleSaveExpense = async (updatedExpense) => {
    try {
      // Debug logging
  console.debug('Sending expense data:', updatedExpense);
      
      let response;
      
      if (updatedExpense.id) {
        // Update existing expense
        response = await fetch(`http://localhost:5000/api/expenses/${updatedExpense.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedExpense)
        });
      } else {
        // Add new expense
        response = await fetch('http://localhost:5000/api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedExpense)
        });
      }

      if (!response.ok) {
        // Get detailed error message from server
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || `Server returned ${response.status}`);
      }

      const result = await response.json();
  console.debug('Expense saved successfully:', result);

      // Refresh the data
      await fetchExpenses();
      setShowEditModal(false);
      setEditingExpense(null);
    } catch (err) {
      console.error('Error saving expense:', err);
      alert(`Failed to save expense: ${err.message}`);
    }
  };

  const handleAction = (action, expense) => {
    switch (action) {
      case 'edit':
        handleEdit(expense);
        break;
      case 'delete':
        handleDelete(expense);
        break;

      default:
        break;
    }
  };

  // Edit Modal Component
  const EditExpenseModal = () => {
    const [formData, setFormData] = useState(editingExpense || {});
    const [expenseItems, setExpenseItems] = useState([
      { item_no: 1, description: '', quantity: 1, unit_price: 0, amount: 0 }
    ]);
    const [subcategory, setSubcategory] = useState('');
    
    useEffect(() => {
      if (editingExpense) {
        // Determine the category type from the existing category
        const existingCategoryType = getCategoryType(editingExpense.category) || 'Expense';
        
        setFormData({
          ...editingExpense,
          categoryType: existingCategoryType
        });
        // Set the existing category name
        setSubcategory(editingExpense.category || '');
        
        // If editing and has items, use them; otherwise use default single item
        if (editingExpense.items && editingExpense.items.length > 0) {
          setExpenseItems(editingExpense.items);
        } else {
          // Create single item from existing expense data
          setExpenseItems([{
            item_no: 1,
            description: editingExpense.title || '',
            quantity: 1,
            unit_price: editingExpense.amount || 0,
            amount: editingExpense.amount || 0
          }]);
        }
      } else {
        // Reset for new expense with proper default values
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          title: '',
          date: today,
          vendor: '',
          amount: 0,
          category: '',
          categoryType: 'Expense',
          paymentMethod: 'Cash',
          status: 'Pending',
          description: ''
        });
        setSubcategory('');
        setExpenseItems([
          { item_no: 1, description: '', quantity: 1, unit_price: 0, amount: 0 }
        ]);
      }
    }, [editingExpense]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubcategoryChange = (newSubcategory) => {
      setSubcategory(newSubcategory);
      setFormData(prev => ({
        ...prev,
        category: newSubcategory
      }));
    };

    // Handle item changes
    const handleItemChange = (index, field, value) => {
      const updatedItems = [...expenseItems];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      
      // Auto-calculate amount for quantity and unit_price changes
      if (field === 'quantity' || field === 'unit_price') {
        const quantity = field === 'quantity' ? parseFloat(value) || 0 : updatedItems[index].quantity;
        const unitPrice = field === 'unit_price' ? parseFloat(value) || 0 : updatedItems[index].unit_price;
        updatedItems[index].amount = quantity * unitPrice;
      }
      
      setExpenseItems(updatedItems);
      
      // Update total amount in form data
      const totalAmount = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
      setFormData(prev => ({
        ...prev,
        amount: totalAmount
      }));
    };

    // Add new item
    const addNewItem = () => {
      const newItemNo = expenseItems.length + 1;
      setExpenseItems([...expenseItems, {
        item_no: newItemNo,
        description: '',
        quantity: 1,
        unit_price: 0,
        amount: 0
      }]);
    };

    // Remove item
    const removeItem = (index) => {
      if (expenseItems.length > 1) {
        const updatedItems = expenseItems.filter((_, i) => i !== index);
        // Update item numbers
        const reorderedItems = updatedItems.map((item, i) => ({
          ...item,
          item_no: i + 1
        }));
        setExpenseItems(reorderedItems);
        
        // Update total amount
        const totalAmount = reorderedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
        setFormData(prev => ({
          ...prev,
          amount: totalAmount
        }));
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validate required fields
      if (!formData.title || !formData.date || !formData.vendor || !subcategory || !subcategory.trim() || !formData.paymentMethod) {
        alert('Please fill in all required fields: Title, Date, Vendor, Category, and Payment Method');
        return;
      }

      // Validate items
      const validItems = expenseItems.filter(item => 
        item.description && item.description.trim() !== '' && 
        item.quantity > 0 && 
        item.unit_price >= 0
      );

      if (validItems.length === 0) {
        alert('Please add at least one valid item with description, quantity, and unit price');
        return;
      }

      // Calculate total amount from valid items
      const totalAmount = validItems.reduce((sum, item) => sum + (item.amount || 0), 0);

      // Prepare data with items
      const expenseData = {
        ...formData,
        category: subcategory,
        categoryType: formData.categoryType || 'Expense',
        amount: totalAmount,
        items: validItems.map((item, index) => ({
          ...item,
          item_no: index + 1
        }))
      };
      
  console.debug('Submitting expense data:', expenseData);
      handleSaveExpense(expenseData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div ref={editModalRef} className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            {formData.id ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <input
                  type="text"
                  name="vendor"
                  value={formData.vendor || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="space-y-2">
                  {/* Type Selection */}
                  <select
                    value={formData.categoryType || 'Expense'}
                    onChange={(e) => {
                      const type = e.target.value;
                      setFormData(prev => ({ ...prev, categoryType: type }));
                    }}
                    className="w-full p-2 border rounded-md text-sm"
                    required
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                    <option value="Asset">Asset</option>
                    <option value="Liability">Liability</option>
                  </select>
                  
                  {/* Category Name Input */}
                  <CategoryAutocomplete
                    value={subcategory}
                    onChange={handleSubcategoryChange}
                    placeholder="Type category name..."
                    categoryType={formData.categoryType || 'Expense'}
                    required
                  />
                </div>
              </div>
              {expenseItems.length > 1 && (
                <p className="text-xs text-gray-500 mt-1">
                  Category applies to all items. Create separate expenses for different categories.
                </p>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod || 'Cash'}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status || 'Pending'}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  {statusOptions.filter(stat => stat !== 'All').map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expense Items */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Expense Items</label>
                <button
                  type="button"
                  onClick={addNewItem}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
                >
                  + Add Item
                </button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">Qty</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">Unit Price</th>
                      <th className="px-3 py-2 text-right text-sm font-medium text-gray-700">Amount</th>
                      <th className="px-3 py-2 text-center text-sm font-medium text-gray-700"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expenseItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="w-full p-1 border rounded text-sm"
                            placeholder="Item description"
                            required
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="w-full p-1 border rounded text-sm text-right"
                            min="0"
                            step="1"
                            required
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={item.unit_price}
                            onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                            className="w-full p-1 border rounded text-sm text-right"
                            min="0"
                            step="0.01"
                            required
                          />
                        </td>
                        <td className="px-3 py-2 text-right font-medium">
                          {item.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {expenseItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-3 py-2 text-right font-semibold">Total Amount:</td>
                      <td className="px-3 py-2 text-right font-bold">
                        PKR {formData.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                rows="3"
                placeholder="Additional notes or description"
              />
            </div>
            
            {/* Action buttons */}
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
                Save Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-[30px] shadow-sm border border-gray-100 p-4 sm:p-5 flex justify-center items-center h-64">
        <div className="text-gray-500">Loading expenses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl sm:rounded-[30px] shadow-sm border border-gray-100 p-4 sm:p-5 flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <div>{error}</div>
          <button 
            onClick={fetchExpenses}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-[30px] shadow-sm border border-gray-100 p-4 sm:p-5">
      {/* Category Statistics */}
      <SimpleCategoryStats />
      
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
            <button 
              className="flex items-center gap-1 bg-[#1976D2] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors"
              onClick={handleAddExpense}
            >
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
        <div ref={filterPanelRef} className="bg-gray-50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Expense Title</label>
            <input
              type="text"
              name="title"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.title}
              onChange={handleFilterChange}
              onMouseDown={(e) => e.stopPropagation()}
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
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Filter by vendor"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Min Amount</label>
            <input
              type="number"
              name="minAmount"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.minAmount}
              onChange={handleFilterChange}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Minimum amount"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Max Amount</label>
            <input
              type="number"
              name="maxAmount"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.maxAmount}
              onChange={handleFilterChange}
              onMouseDown={(e) => e.stopPropagation()}
              placeholder="Maximum amount"
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
              onMouseDown={(e) => e.stopPropagation()}
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
              onMouseDown={(e) => e.stopPropagation()}
            />
          </div>
          {/* Category and Status filters intentionally hidden per user request */}
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
          {tabCategories.map(category => (
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
                <th className="pb-3 px-2 whitespace-nowrap hidden lg:table-cell">Description</th>
                <th className="pb-3 px-2 whitespace-nowrap"></th>
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
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap hidden sm:table-cell">
                      {expense.vendor}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      PKR {expense.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                      <span className={`px-2 py-1 inline-flex items-center justify-center text-xs font-semibold rounded-full ${getCategoryClass(expense.category)}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap hidden md:table-cell">
                      {expense.paymentMethod}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap text-center">
                      <span className={`px-2 py-1 inline-flex items-center justify-center text-xs font-semibold rounded-full ${getStatusClass(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap hidden lg:table-cell">
                      <div className="max-w-xs truncate">{expense.description}</div>
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

                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-blue-50 border-t-2 border-blue-200">
                <td colSpan="3" className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                  Total Expenditures:
                </td>
                <td className="px-4 py-3 text-sm font-bold text-blue-600">
                  PKR {filteredExpenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td colSpan="6"></td>
              </tr>
            </tfoot>
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
              {pages.map((p, idx) => (
                p === '...' ? (
                  <div key={`dots-${idx}`} className="px-3 py-1 text-sm rounded-md min-w-[36px] flex items-center justify-center">...</div>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`px-3 py-1 text-sm rounded-md min-w-[36px] ${
                      currentPage === p
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    } border`}
                  >
                    {p}
                  </button>
                )
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

      {/* Edit Modal */}
      {showEditModal && <EditExpenseModal />}
    </div>
  );
};

export default ExpenseTable;