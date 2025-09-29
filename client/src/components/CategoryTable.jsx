import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, FileDown, Ellipsis, Edit, Trash2, Printer, Download, Copy, Plus, Tag, FolderOpen } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const CategoryTable = () => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [filters, setFilters] = useState({
    name: '',
    description: '',
    type: '',
    status: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const dropdownRef = useRef(null);

  const categoryTypes = ['All', 'Expense', 'Income', 'Asset', 'Liability'];
  const statusOptions = ['All', 'Active', 'Inactive'];

  // Show notification
  const showNotification = (title, description, duration = 3000) => {
    setNotification({ title, description });
    setTimeout(() => setNotification(null), duration);
  };

  // Fetch categories data from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // For now, we'll use mock data since backend doesn't have categories endpoint yet
      // You can replace this with actual API call later
      const mockCategories = [
        {
          id: 1,
          name: 'Materials',
          description: 'Raw materials and supplies for production',
          type: 'Expense',
          status: 'Active',
          color: '#3B82F6',
          icon: 'FolderOpen',
          createdDate: '2025-01-15',
          expenseCount: 15
        },
        {
          id: 2,
          name: 'Equipment',
          description: 'Machinery and equipment purchases',
          type: 'Expense', 
          status: 'Active',
          color: '#8B5CF6',
          icon: 'Tag',
          createdDate: '2025-01-20',
          expenseCount: 8
        },
        {
          id: 3,
          name: 'Administrative',
          description: 'Office supplies and administrative costs',
          type: 'Expense',
          status: 'Active', 
          color: '#F59E0B',
          icon: 'FolderOpen',
          createdDate: '2025-02-01',
          expenseCount: 12
        },
        {
          id: 4,
          name: 'Utilities',
          description: 'Electricity, water, and other utilities',
          type: 'Expense',
          status: 'Active',
          color: '#EF4444',
          icon: 'Tag', 
          createdDate: '2025-02-10',
          expenseCount: 6
        },
        {
          id: 5,
          name: 'Payroll',
          description: 'Employee salaries and benefits',
          type: 'Expense',
          status: 'Active',
          color: '#6366F1',
          icon: 'FolderOpen',
          createdDate: '2025-02-15',
          expenseCount: 24
        },
        {
          id: 6,
          name: 'Logistics',
          description: 'Transportation and delivery costs',
          type: 'Expense',
          status: 'Active',
          color: '#14B8A6',
          icon: 'Tag',
          createdDate: '2025-03-01',
          expenseCount: 9
        },
        {
          id: 7,
          name: 'Sales Revenue',
          description: 'Income from product sales',
          type: 'Income',
          status: 'Active',
          color: '#10B981',
          icon: 'FolderOpen',
          createdDate: '2025-01-10',
          expenseCount: 0
        },
        {
          id: 8,
          name: 'Marketing',
          description: 'Advertising and promotional expenses',
          type: 'Expense',
          status: 'Inactive',
          color: '#F97316',
          icon: 'Tag',
          createdDate: '2025-01-25',
          expenseCount: 3
        }
      ];
      
      setCategoriesData(mockCategories);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

  const filteredCategories = categoriesData
    .filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(category =>
      activeTab === 'All' || category.type === activeTab
    )
    .filter(category =>
      (!filters.name || category.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.description || category.description.toLowerCase().includes(filters.description.toLowerCase())) &&
      (!filters.type || category.type === filters.type) &&
      (!filters.status || category.status === filters.status)
    );

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleCategories = filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleSelectAll = () => {
    if (selectedRows.length === visibleCategories.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(visibleCategories.map(category => category.id));
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
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeClass = (type) => {
    switch(type) {
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
      name: '',
      description: '',
      type: '',
      status: ''
    });
    setSearchTerm('');
    setActiveTab('All');
    showNotification('Filters Reset', 'All filters have been cleared');
  };

  const toggleDropdown = (categoryId, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
  };

  // Action functions
  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  const handleDelete = async (category) => {
    if (category.expenseCount > 0) {
      alert(`Cannot delete category "${category.name}" because it has ${category.expenseCount} associated expenses. Please move or delete those expenses first.`);
      setActiveDropdown(null);
      return;
    }

    if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      try {
        // Simulate API call - replace with actual API call later
        setCategoriesData(prev => prev.filter(cat => cat.id !== category.id));
        showNotification('Category Deleted', `Category "${category.name}" has been deleted successfully`);
      } catch (err) {
        console.error('Error deleting category:', err);
        showNotification('Error', 'Failed to delete category. Please try again.');
      }
    }
    setActiveDropdown(null);
  };

  const handlePrint = (category) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Category Details: ${category.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            .category-card { border: 1px solid #ddd; padding: 20px; max-width: 500px; margin: 0 auto; }
            .row { display: flex; margin-bottom: 10px; }
            .label { font-weight: bold; width: 150px; }
            .value { flex: 1; }
            .color-indicator { display: inline-block; width: 20px; height: 20px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>Category Details</h1>
          <div class="category-card">
            <div class="row"><div class="label">Name:</div><div class="value">${category.name}</div></div>
            <div class="row"><div class="label">Description:</div><div class="value">${category.description}</div></div>
            <div class="row"><div class="label">Type:</div><div class="value">${category.type}</div></div>
            <div class="row"><div class="label">Status:</div><div class="value">${category.status}</div></div>
            <div class="row"><div class="label">Color:</div><div class="value"><span class="color-indicator" style="background-color: ${category.color}"></span> ${category.color}</div></div>
            <div class="row"><div class="label">Created Date:</div><div class="value">${new Date(category.createdDate).toLocaleDateString()}</div></div>
            <div class="row"><div class="label">Expense Count:</div><div class="value">${category.expenseCount}</div></div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setActiveDropdown(null);
  };

  const handleDownload = (category) => {
    const data = {
      id: category.id,
      name: category.name,
      description: category.description,
      type: category.type,
      status: category.status,
      color: category.color,
      icon: category.icon,
      createdDate: category.createdDate,
      expenseCount: category.expenseCount
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `category_${category.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setActiveDropdown(null);
    showNotification('Download Complete', `Category data downloaded successfully`);
  };

  const handleDuplicate = async (category) => {
    const newCategory = {
      id: Math.max(...categoriesData.map(cat => cat.id)) + 1,
      name: `${category.name} (Copy)`,
      description: category.description,
      type: category.type,
      status: 'Active',
      color: category.color,
      icon: category.icon,
      createdDate: new Date().toISOString().split('T')[0],
      expenseCount: 0
    };
    
    try {
      setCategoriesData(prev => [...prev, newCategory]);
      showNotification('Category Duplicated', `Category "${newCategory.name}" has been created successfully`);
    } catch (err) {
      console.error('Error duplicating category:', err);
      showNotification('Error', 'Failed to duplicate category. Please try again.');
    }
    
    setActiveDropdown(null);
  };

  const handleAddCategory = () => {
    const newCategory = {
      name: 'New Category',
      description: '',
      type: 'Expense',
      status: 'Active',
      color: '#3B82F6',
      icon: 'FolderOpen',
      createdDate: new Date().toISOString().split('T')[0],
      expenseCount: 0
    };
    
    setEditingCategory(newCategory);
    setShowEditModal(true);
  };

  const handleSaveCategory = async (updatedCategory) => {
    try {
      if (updatedCategory.id) {
        // Update existing category
        setCategoriesData(prev => 
          prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
        );
        showNotification('Category Updated', `Category "${updatedCategory.name}" has been updated successfully`);
      } else {
        // Add new category
        const newCategory = {
          ...updatedCategory,
          id: Math.max(...categoriesData.map(cat => cat.id)) + 1
        };
        setCategoriesData(prev => [...prev, newCategory]);
        showNotification('Category Created', `Category "${updatedCategory.name}" has been created successfully`);
      }

      setShowEditModal(false);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error saving category:', err);
      showNotification('Error', 'Failed to save category. Please try again.');
    }
  };

  const handleAction = (action, category) => {
    switch (action) {
      case 'edit':
        handleEdit(category);
        break;
      case 'delete':
        handleDelete(category);
        break;
      case 'print':
        handlePrint(category);
        break;
      case 'download':
        handleDownload(category);
        break;
      case 'duplicate':
        handleDuplicate(category);
        break;
      default:
        break;
    }
  };

  // Edit Modal Component
  const EditCategoryModal = () => {
    const [formData, setFormData] = useState(editingCategory || {});
    const iconOptions = ['FolderOpen', 'Tag'];
    const colorOptions = [
      '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#6366F1', 
      '#14B8A6', '#10B981', '#F97316', '#EC4899', '#84CC16'
    ];
    
    useEffect(() => {
      setFormData(editingCategory || {});
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
      handleSaveCategory(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            {formData.id ? 'Edit Category' : 'Create New Category'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
                placeholder="Enter category name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                rows="3"
                placeholder="Enter category description"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                name="type"
                value={formData.type || 'Expense'}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                {categoryTypes.filter(type => type !== 'All').map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status || 'Active'}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                {statusOptions.filter(status => status !== 'All').map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
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
                {formData.id ? 'Update' : 'Create'} Category
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
        <div className="text-gray-500">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl sm:rounded-[30px] shadow-sm border border-gray-100 p-4 sm:p-5 flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <div>{error}</div>
          <button 
            onClick={fetchCategories}
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
          <h2 className="text-lg sm:text-xl font-semibold">Categories</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Create and manage expense categories
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="pl-10 pr-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              className="flex items-center gap-1 bg-[#1976D2] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors"
              onClick={handleAddCategory}
            >
              <Plus className="w-4 h-4" />
              <span>Create Category</span>
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
        <div className="bg-gray-50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Category Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Filter by name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              name="description"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.description}
              onChange={handleFilterChange}
              placeholder="Filter by description"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
            <select
              name="type"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              {categoryTypes.filter(type => type !== 'All').map(type => (
                <option key={type} value={type}>{type}</option>
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
              <option value="">All Status</option>
              {statusOptions.filter(status => status !== 'All').map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-4 flex justify-end gap-2">
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
          {categoryTypes.map(type => (
            <button
              key={type}
              className={`px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === type
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                setActiveTab(type);
                setCurrentPage(1);
              }}
            >
              {type}
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
                      visibleCategories.length > 0 &&
                      selectedRows.length === visibleCategories.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                </th>
                <th className="pb-3 px-2 whitespace-nowrap text-left">Category</th>
                <th className="pb-3 px-2 whitespace-nowrap">Description</th>
                <th className="pb-3 px-2 whitespace-nowrap">Type</th>
                <th className="pb-3 px-2 whitespace-nowrap">Status</th>
                <th className="pb-3 px-2 whitespace-nowrap hidden md:table-cell">Created Date</th>
                <th className="pb-3 px-2 whitespace-nowrap hidden lg:table-cell">Expense Count</th>
                <th className="pb-3 px-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="text-center divide-y divide-gray-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-4 text-center text-sm text-gray-500">
                    No categories found matching your criteria
                  </td>
                </tr>
              ) : (
                visibleCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(category.id)}
                        onChange={() => toggleSelectRow(category.id)}
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap text-left">
                      <div className="flex items-center gap-2">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap max-w-xs">
                      <div className="truncate">{category.description}</div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getTypeClass(category.type)}`}>
                        {category.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusClass(category.status)}`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap hidden md:table-cell">
                      {new Date(category.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap hidden lg:table-cell">
                      <span className="font-medium">{category.expenseCount}</span>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap relative">
                      <div className="flex justify-center">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => toggleDropdown(category.id, e)}
                        >
                          <Ellipsis className="h-5 w-5" />
                        </button>
                        
                        {activeDropdown === category.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleAction('edit', category)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleAction('delete', category)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                              <button
                                onClick={() => handleAction('print', category)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                              </button>
                              <button
                                onClick={() => handleAction('download', category)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </button>
                              <button
                                onClick={() => handleAction('duplicate', category)}
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
      {filteredCategories.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-white gap-3">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredCategories.length)} of {filteredCategories.length} categories
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
      {showEditModal && <EditCategoryModal />}
    </div>
  );
};

export default CategoryTable;