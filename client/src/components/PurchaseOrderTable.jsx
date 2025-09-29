import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  FileDown, 
  Ellipsis, 
  Edit, 
  Trash2, 
  Printer, 
  Download, 
  Copy, 
  Plus, 
  Eye,
  X,
  History,
  DollarSign,
  TrendingUp,
  Clock,
  XCircle,
  RotateCcw
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const PurchaseOrderTable = ({ onViewDetails }) => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [filters, setFilters] = useState({
    supplier: '',
    minAmount: '',
    maxAmount: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingPO, setEditingPO] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [poSummaries, setPOSummaries] = useState({});
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPOHistory, setSelectedPOHistory] = useState(null);
  const [invoiceHistory, setInvoiceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const dropdownRef = useRef(null);

  const statusTabs = ['All', 'Draft', 'Pending', 'Approved', 'Received', 'Cancelled'];

  // Fetch purchase orders from API
  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching purchase orders from API...');
      
      const response = await fetch('http://localhost:5000/api/purchase-orders');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Transform API data to match frontend format
      const transformedData = data.map(po => ({
        id: po.po_number || po.id,
        date: po.po_date,
        supplier: po.supplier_name,
        totalAmount: po.total_amount,
        currency: po.currency || 'PKR',
        status: po.status,
        items: po.items_count || 0,
        // Store original data for editing
        originalData: po
      }));
      
      setPurchaseOrders(transformedData);
      setError(null);
      console.log('Transformed data:', transformedData);
      
      // Fetch PO summaries for invoice tracking
      await fetchPOSummaries();
      
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      setError(`Failed to load purchase orders: ${error.message}`);
      showNotification('Error', `Failed to load purchase orders: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch PO invoice summaries
  const fetchPOSummaries = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/po-summaries');
      if (response.ok) {
        const summaries = await response.json();
        const summaryMap = {};
        summaries.forEach(summary => {
          summaryMap[summary.po_number] = summary;
        });
        setPOSummaries(summaryMap);
      }
    } catch (error) {
      console.error('Error fetching PO summaries:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  // Calculate counts for each status
  const getStatusCounts = () => {
    const basePOs = purchaseOrders
      .filter(po =>
        po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(po =>
        (!filters.supplier || po.supplier.toLowerCase().includes(filters.supplier.toLowerCase())) &&
        (!filters.minAmount || po.totalAmount >= parseFloat(filters.minAmount)) &&
        (!filters.maxAmount || po.totalAmount <= parseFloat(filters.maxAmount)) &&
        (!filters.dateFrom || new Date(po.date) >= new Date(filters.dateFrom)) &&
        (!filters.dateTo || new Date(po.date) <= new Date(filters.dateTo))
      );

    const counts = {
      'All': basePOs.length,
      'Draft': basePOs.filter(po => po.status === 'Draft').length,
      'Pending': basePOs.filter(po => po.status === 'Pending').length,
      'Approved': basePOs.filter(po => po.status === 'Approved').length,
      'Received': basePOs.filter(po => po.status === 'Received').length,
      'Cancelled': basePOs.filter(po => po.status === 'Cancelled').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  const showNotification = (title, description, type = 'success', duration = 5000) => {
    setNotification({ title, description, type });
    setTimeout(() => setNotification(null), duration);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      case 'Received': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvoicingStatus = (poNumber) => {
    const summary = poSummaries[poNumber];
    if (!summary) return { status: 'Not Invoiced', color: 'gray', percentage: 0 };
    
    const percentage = summary.po_total_amount > 0 ? 
      (summary.total_invoiced_amount / summary.po_total_amount) * 100 : 0;
    
    if (percentage >= 100) {
      return { status: 'Fully Invoiced', color: 'green', percentage: 100 };
    } else if (percentage > 0) {
      return { status: 'Partially Invoiced', color: 'blue', percentage: Math.round(percentage) };
    } else {
      return { status: 'Not Invoiced', color: 'gray', percentage: 0 };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredPOs = purchaseOrders
    .filter(po =>
      po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(po => activeTab === 'All' || po.status === activeTab)
    .filter(po =>
      (!filters.supplier || po.supplier.toLowerCase().includes(filters.supplier.toLowerCase())) &&
      (!filters.minAmount || po.totalAmount >= parseFloat(filters.minAmount)) &&
      (!filters.maxAmount || po.totalAmount <= parseFloat(filters.maxAmount)) &&
      (!filters.dateFrom || new Date(po.date) >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || new Date(po.date) <= new Date(filters.dateTo))
    );

  const totalPages = Math.ceil(filteredPOs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visiblePOs = filteredPOs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleSelectAll = () => {
    if (selectedRows.length === visiblePOs.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(visiblePOs.map(po => po.id));
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
      supplier: '',
      minAmount: '',
      maxAmount: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchTerm('');
    setActiveTab('All');
    setCurrentPage(1);
    showNotification('Filters Reset', 'All filters have been cleared');
  };

  const toggleDropdown = (poId, e) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === poId ? null : poId);
  };

  // Action handlers
  const handleView = (po) => {
    onViewDetails(po.id);
    setActiveDropdown(null);
  };

  const handleEdit = (po) => {
    setEditingPO(po);
    setShowEditModal(true);
    setActiveDropdown(null);
  };

  // Cancel PO (move to cancelled status)
  const handleCancel = async (po) => {
    if (window.confirm(`Are you sure you want to cancel PO ${po.id}?`)) {
      try {
        // Store original status for potential restoration
        const updatedPO = {
          ...po.originalData,
          status: 'Cancelled',
          previous_status: po.status // Store current status for restoration
        };

        const response = await fetch(`http://localhost:5000/api/purchase-orders/${po.originalData?.id || po.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPO)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to cancel PO: ${response.statusText}`);
        }

        showNotification('PO Cancelled', `Purchase Order ${po.id} has been cancelled`);
        // Refresh the list to reflect changes
        fetchPurchaseOrders();
        
      } catch (error) {
        console.error('Error cancelling PO:', error);
        showNotification('Error', `Failed to cancel PO: ${error.message}`, 'error');
      }
    }
    setActiveDropdown(null);
  };

  // Restore cancelled PO to previous status
  const handleRestore = async (po) => {
    if (window.confirm(`Are you sure you want to restore PO ${po.id}?`)) {
      try {
        const restoreStatus = po.originalData?.previous_status || 'Draft';
        const updatedPO = {
          ...po.originalData,
          status: restoreStatus,
          previous_status: null // Clear previous status
        };

        const response = await fetch(`http://localhost:5000/api/purchase-orders/${po.originalData?.id || po.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPO)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to restore PO: ${response.statusText}`);
        }

        showNotification('PO Restored', `Purchase Order ${po.id} has been restored to ${restoreStatus}`);
        // Refresh the list to reflect changes
        fetchPurchaseOrders();
        
      } catch (error) {
        console.error('Error restoring PO:', error);
        showNotification('Error', `Failed to restore PO: ${error.message}`, 'error');
      }
    }
    setActiveDropdown(null);
  };

  // Permanently delete PO from database
  const handlePermanentDelete = async (po) => {
    if (window.confirm(`⚠️ PERMANENT DELETE ⚠️\n\nThis will completely remove PO ${po.id} from the database.\nThis action CANNOT be undone!\n\nAre you absolutely sure?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/purchase-orders/${po.originalData?.id || po.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`Failed to permanently delete PO: ${response.statusText}`);
        }
        
        showNotification('PO Permanently Deleted', `Purchase Order ${po.id} has been permanently removed`, 'error');
        // Refresh the list to reflect changes
        fetchPurchaseOrders();
        
      } catch (error) {
        console.error('Error permanently deleting PO:', error);
        showNotification('Error', `Failed to permanently delete PO: ${error.message}`, 'error');
      }
    }
    setActiveDropdown(null);
  };

  const handleDuplicate = (po) => {
    const newPO = {
      ...po,
      id: generateNewPOId(),
      date: new Date().toISOString().split('T')[0],
      status: 'Draft'
    };
    setPurchaseOrders(prev => [...prev, newPO]);
    showNotification('PO Duplicated', `New PO ${newPO.id} created from ${po.id}`);
    setActiveDropdown(null);
  };

  const handleViewHistory = async (po) => {
    setSelectedPOHistory(po);
    setLoadingHistory(true);
    setShowHistoryModal(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/purchase-orders/${po.id}/invoices`);
      if (response.ok) {
        const history = await response.json();
        setInvoiceHistory(history);
      } else {
        setInvoiceHistory([]);
        showNotification('Info', 'No invoice history found for this PO', 'info');
      }
    } catch (error) {
      console.error('Error fetching invoice history:', error);
      setInvoiceHistory([]);
      showNotification('Error', 'Failed to load invoice history', 'error');
    } finally {
      setLoadingHistory(false);
    }
    setActiveDropdown(null);
  };

  const handlePrint = (po) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Purchase Order: ${po.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            .po-details { border: 1px solid #ddd; padding: 20px; max-width: 600px; }
            .row { display: flex; margin-bottom: 10px; }
            .label { font-weight: bold; width: 150px; }
            .value { flex: 1; }
          </style>
        </head>
        <body>
          <h1>Purchase Order Details</h1>
          <div class="po-details">
            <div class="row"><div class="label">PO ID:</div><div class="value">${po.id}</div></div>
            <div class="row"><div class="label">Date:</div><div class="value">${po.date}</div></div>
            <div class="row"><div class="label">Supplier:</div><div class="value">${po.supplier}</div></div>
            <div class="row"><div class="label">Amount:</div><div class="value">${po.currency} ${po.totalAmount.toLocaleString()}</div></div>
            <div class="row"><div class="label">Status:</div><div class="value">${po.status}</div></div>
            <div class="row"><div class="label">Items:</div><div class="value">${po.items}</div></div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setActiveDropdown(null);
  };

  const handleDownload = (po) => {
    const data = {
      id: po.id,
      date: po.date,
      supplier: po.supplier,
      totalAmount: po.totalAmount,
      currency: po.currency,
      status: po.status,
      items: po.items
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PO_${po.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setActiveDropdown(null);
    showNotification('Download Complete', `PO data downloaded successfully`);
  };

  const generateNewPOId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // Check if PO with this timestamp already exists
    const baseId = `PO-${year}${month}${day}-${hours}${minutes}${seconds}`;
    let counter = 1;
    let finalId = baseId;
    
    while (purchaseOrders.some(po => po.id === finalId)) {
      finalId = `${baseId}-${counter}`;
      counter++;
    }
    
    return finalId;
  };

  const handleAddPO = () => {
    // Clear editing state to trigger new PO creation
    setEditingPO(null);
    setShowEditModal(true);
  };

  const handleSavePO = async (poData) => {
    console.log('Saving PO:', poData);
    
    try {
      const isEditing = editingPO && editingPO.id;
      const url = isEditing ? 
        `http://localhost:5000/api/purchase-orders/${editingPO.id}` : 
        'http://localhost:5000/api/purchase-orders';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      // Prepare the data for backend
      const submitData = {
        po_number: poData.po_number || poData.id,
        po_date: poData.po_date || poData.date,
        supplier_name: poData.supplier_name || poData.supplier,
        supplier_email: poData.supplier_email || '',
        supplier_phone: poData.supplier_phone || '',
        supplier_address: poData.supplier_address || '',
        subtotal: poData.subtotal || 0,
        tax_rate: poData.tax_rate || 0,
        tax_amount: poData.tax_amount || 0,
        total_amount: poData.total_amount || poData.totalAmount || 0,
        currency: poData.currency || 'PKR',
        status: poData.status || 'Draft',
        notes: poData.notes || '',
        items: poData.items || []
      };

      console.log('Sending to backend:', submitData);
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const result = await response.json();
      console.log('Backend response:', result);

      if (isEditing) {
        // Update existing PO in local state
        setPurchaseOrders(prev => prev.map(po => 
          po.id === editingPO.id ? {
            ...po,
            ...result.purchase_order,
            id: result.purchase_order.po_number,
            date: result.purchase_order.po_date,
            supplier: result.purchase_order.supplier_name,
            totalAmount: result.purchase_order.total_amount,
            items: result.purchase_order.items?.length || 0
          } : po
        ));
        showNotification('PO Updated', `Purchase Order ${result.purchase_order.po_number} has been updated successfully`);
      } else {
        // Add new PO to local state
        const newPO = {
          id: result.purchase_order.po_number,
          date: result.purchase_order.po_date,
          supplier: result.purchase_order.supplier_name,
          totalAmount: result.purchase_order.total_amount,
          currency: result.purchase_order.currency,
          status: result.purchase_order.status,
          items: result.purchase_order.items?.length || 0
        };
        
        setPurchaseOrders(prev => [...prev, newPO]);
        showNotification('PO Created', `Purchase Order ${result.purchase_order.po_number} has been created successfully`);
      }
      
      setShowEditModal(false);
      setEditingPO(null);
      
      // Refresh the purchase orders list
      fetchPurchaseOrders();
      
    } catch (error) {
      console.error('Error saving PO:', error);
      showNotification('Error', `Failed to save purchase order: ${error.message}`, 'error');
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

  // History Modal Component
  const HistoryModal = () => {
    const invoiceStatus = selectedPOHistory ? getInvoicingStatus(selectedPOHistory.id) : null;
    const summary = selectedPOHistory ? poSummaries[selectedPOHistory.id] : null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Invoice History - {selectedPOHistory?.id}</h2>
            <button
              onClick={() => setShowHistoryModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* PO Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">PO Total</div>
                <div className="font-semibold text-lg">
                  {selectedPOHistory && formatCurrency(selectedPOHistory.totalAmount)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Invoiced</div>
                <div className="font-semibold text-lg text-blue-600">
                  {summary ? formatCurrency(summary.total_invoiced_amount) : formatCurrency(0)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Remaining</div>
                <div className="font-semibold text-lg text-green-600">
                  {summary ? formatCurrency(summary.remaining_amount) : formatCurrency(selectedPOHistory?.totalAmount || 0)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Status</div>
                <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  invoiceStatus?.color === 'green' ? 'bg-green-100 text-green-800' :
                  invoiceStatus?.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {invoiceStatus?.status || 'Not Invoiced'}
                </div>
              </div>
            </div>
          </div>

          {/* Invoice History Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingHistory ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span>Loading invoice history...</span>
                      </div>
                    </td>
                  </tr>
                ) : invoiceHistory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No invoices created for this Purchase Order yet
                    </td>
                  </tr>
                ) : (
                  invoiceHistory.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoice_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.invoice_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(invoice.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                          invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.customer_name}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit PO Modal Component
  const EditPOModal = () => {
    const [formData, setFormData] = useState(editingPO || {});
    const [poItems, setPOItems] = useState([
      { item_no: 1, description: '', quantity: 1, unit_price: 0, amount: 0, specifications: '' }
    ]);
    const [taxRate, setTaxRate] = useState(0);

    useEffect(() => {
      if (editingPO) {
        setFormData(editingPO);
        setTaxRate(editingPO.tax_rate || 0);
        
        // If editing and has items, use them; otherwise use default single item
        if (editingPO.items && editingPO.items.length > 0) {
          setPOItems(editingPO.items);
        } else {
          // Create single item from existing PO data
          setPOItems([{
            item_no: 1,
            description: 'Purchase Item',
            quantity: editingPO.items || 1,
            unit_price: editingPO.totalAmount || 0,
            amount: editingPO.totalAmount || 0
          }]);
        }
      } else {
        // Reset for new PO with proper default values
        const today = new Date().toISOString().split('T')[0];
        const newPOId = generateNewPOId();
        
        setFormData({
          id: newPOId,
          po_number: newPOId,
          po_date: today,
          supplier_name: '',
          supplier_email: '',
          supplier_phone: '',
          supplier_address: '',
          subtotal: 0,
          tax_rate: 0,
          tax_amount: 0,
          total_amount: 0,
          currency: 'PKR',
          status: 'Draft',
          notes: ''
        });
        setTaxRate(0);
        setPOItems([
          { item_no: 1, description: '', quantity: 1, unit_price: 0, amount: 0 }
        ]);
      }
    }, [editingPO]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleTaxRateChange = (e) => {
      const newTaxRate = parseFloat(e.target.value) || 0;
      setTaxRate(newTaxRate);
      
      // Recalculate totals
      const subtotal = poItems.reduce((sum, item) => sum + (item.amount || 0), 0);
      const taxAmount = subtotal * (newTaxRate / 100);
      const total = subtotal + taxAmount;
      
      setFormData(prev => ({
        ...prev,
        tax_rate: newTaxRate,
        subtotal: subtotal,
        tax_amount: taxAmount,
        total_amount: total
      }));
    };

    // Handle item changes
    const handleItemChange = (index, field, value) => {
      const updatedItems = [...poItems];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      
      // Auto-calculate amount for quantity and unit_price changes
      if (field === 'quantity' || field === 'unit_price') {
        const quantity = field === 'quantity' ? parseFloat(value) || 0 : updatedItems[index].quantity;
        const unitPrice = field === 'unit_price' ? parseFloat(value) || 0 : updatedItems[index].unit_price;
        updatedItems[index].amount = quantity * unitPrice;
      }
      
      setPOItems(updatedItems);
      
      // Update totals in form data
      const subtotal = updatedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
      const taxAmount = subtotal * (taxRate / 100);
      const total = subtotal + taxAmount;
      
      setFormData(prev => ({
        ...prev,
        subtotal: subtotal,
        tax_amount: taxAmount,
        total_amount: total,
        items: updatedItems.length // Update items count for display
      }));
    };

    // Add new item
    const addNewItem = () => {
      const newItemNo = poItems.length + 1;
      setPOItems([...poItems, {
        item_no: newItemNo,
        description: '',
        quantity: 1,
        unit_price: 0,
        amount: 0
      }]);
    };

    // Remove item
    const removeItem = (index) => {
      if (poItems.length > 1) {
        const updatedItems = poItems.filter((_, i) => i !== index);
        // Update item numbers
        const reorderedItems = updatedItems.map((item, i) => ({
          ...item,
          item_no: i + 1
        }));
        setPOItems(reorderedItems);
        
        // Update totals
        const subtotal = reorderedItems.reduce((sum, item) => sum + (item.amount || 0), 0);
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;
        
        setFormData(prev => ({
          ...prev,
          subtotal: subtotal,
          tax_amount: taxAmount,
          total_amount: total,
          items: reorderedItems.length
        }));
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validate required fields
      if (!formData.po_number || !formData.po_date || !formData.supplier_name) {
        alert('Please fill in all required fields: PO Number, Date, and Supplier Name');
        return;
      }

      // Validate items
      const validItems = poItems.filter(item => 
        item.description && item.description.trim() !== '' && 
        item.quantity > 0 && 
        item.unit_price >= 0
      );

      if (validItems.length === 0) {
        alert('Please add at least one valid item with description & specifications, quantity, and unit price');
        return;
      }

      // Prepare data with items
      const poData = {
        ...formData,
        items: validItems.map((item, index) => ({
          ...item,
          item_no: index + 1
        }))
      };
      
      console.log('Submitting PO data:', poData);
      handleSavePO(poData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            {formData.id && purchaseOrders.some(po => po.id === formData.id) ? 'Edit PO' : 'Create New PO'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PO Number and Date */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">PO Number *</label>
                <input
                  type="text"
                  name="po_number"
                  value={formData.po_number || formData.id || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">PO Date *</label>
                <input
                  type="date"
                  name="po_date"
                  value={formData.po_date || formData.date || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Supplier Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Supplier Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Supplier Name *</label>
                  <input
                    type="text"
                    name="supplier_name"
                    value={formData.supplier_name || formData.supplier || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Supplier Email</label>
                  <input
                    type="email"
                    name="supplier_email"
                    value={formData.supplier_email || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Supplier Phone</label>
                  <input
                    type="text"
                    name="supplier_phone"
                    value={formData.supplier_phone || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Supplier Address</label>
                  <input
                    type="text"
                    name="supplier_address"
                    value={formData.supplier_address || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Purchase Order Items */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">Purchase Order Items</h4>
                <button
                  type="button"
                  onClick={addNewItem}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  + Add Item
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-3 py-3 text-left text-sm font-medium">Item #</th>
                      <th className="border border-gray-300 px-3 py-3 text-left text-sm font-medium">Item Description & Specifications *</th>
                      <th className="border border-gray-300 px-3 py-3 text-left text-sm font-medium">Quantity</th>
                      <th className="border border-gray-300 px-3 py-3 text-left text-sm font-medium">Unit Price (PKR)</th>
                      <th className="border border-gray-300 px-3 py-3 text-left text-sm font-medium">Amount (PKR)</th>
                      <th className="border border-gray-300 px-3 py-3 text-center text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-3 py-3 text-center">
                          <span className="font-medium text-gray-700">{item.item_no}</span>
                        </td>
                        <td className="border border-gray-300 px-3 py-3">
                          <textarea
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                            rows="3"
                            placeholder="Enter item description and specifications..."
                            required
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-3">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="0"
                            step="1"
                            required
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-3">
                          <input
                            type="number"
                            value={item.unit_price}
                            onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                            required
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-3 text-right">
                          <span className="font-bold text-gray-800">
                            {(item.amount || 0).toLocaleString('en-PK', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-3 py-3 text-center">
                          {poItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800 text-lg font-bold"
                              title="Remove Item"
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Purchase Order Totals */}
              <div className="mt-4 bg-white p-4 rounded-lg border">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2"></div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Subtotal:</span>
                      <span className="font-medium">
                        PKR {(formData.subtotal || 0).toLocaleString('en-PK', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">Tax Rate:</span>
                        <input
                          type="number"
                          value={taxRate}
                          onChange={handleTaxRateChange}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                        <span className="text-gray-600">%</span>
                      </div>
                      <span className="font-medium">
                        PKR {(formData.tax_amount || 0).toLocaleString('en-PK', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="font-bold text-lg text-gray-800">Total Amount:</span>
                      <span className="font-bold text-lg text-blue-600">
                        PKR {(formData.total_amount || 0).toLocaleString('en-PK', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status || 'Draft'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Received">Received</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div></div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any additional notes or instructions"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPO(null);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingPO ? 'Update PO' : 'Create PO'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };



  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded ${
          notification.type === 'error' 
            ? 'bg-red-100 border border-red-400 text-red-700' 
            : 'bg-green-100 border border-green-400 text-green-700'
        }`}>
          <div className="font-bold">{notification.title}</div>
          <div>{notification.description}</div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Purchase Orders</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage all your purchase orders and suppliers
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search purchase orders..." 
              className="pl-10 pr-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              className="flex items-center gap-1 bg-[#1976D2] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors"
              onClick={handleAddPO}
            >
              <Plus className="w-4 h-4" />
              <span>Create PO</span>
            </button>
            
            <button
              className="flex items-center gap-1 bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-green-700 transition-colors"
              onClick={fetchPOSummaries}
              title="Refresh Invoice Status"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
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
            <label className="block text-xs font-medium text-gray-700 mb-1">Supplier</label>
            <input
              type="text"
              name="supplier"
              className="w-full p-2 border rounded-md text-xs"
              value={filters.supplier}
              onChange={handleFilterChange}
              placeholder="Filter by supplier"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Min Amount</label>
            <input
              type="number"
              name="minAmount"
              value={filters.minAmount}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md text-xs"
              placeholder="Minimum amount"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Max Amount</label>
            <input
              type="number"
              name="maxAmount"
              value={filters.maxAmount}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded-md text-xs"
              placeholder="Maximum amount"
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
          {statusTabs.map(tab => (
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
              <span className="flex items-center gap-1">
                {tab}
                <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                  activeTab === tab
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {statusCounts[tab]}
                </span>
              </span>
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
                      visiblePOs.length > 0 &&
                      selectedRows.length === visiblePOs.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                </th>
                <th className="pb-3 px-2 whitespace-nowrap text-left">PO ID</th>
                <th className="pb-3 px-2 whitespace-nowrap">Date</th>
                <th className="pb-3 px-2 whitespace-nowrap text-left">Supplier</th>
                <th className="pb-3 px-2 whitespace-nowrap">Amount</th>
                <th className="pb-3 px-2 whitespace-nowrap">Status</th>
                <th className="pb-3 px-2 whitespace-nowrap hidden md:table-cell">Invoice Status</th>
                <th className="pb-3 px-2 whitespace-nowrap hidden sm:table-cell">Remaining</th>
                <th className="pb-3 px-2 whitespace-nowrap hidden lg:table-cell">Items</th>
                <th className="pb-3 px-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="text-center divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span>Loading purchase orders...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-sm text-red-500">
                    <div className="flex flex-col items-center space-y-2">
                      <span>{error}</span>
                      <button 
                        onClick={fetchPurchaseOrders}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredPOs.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-4 text-center text-sm text-gray-500">
                    No purchase orders found matching your criteria
                  </td>
                </tr>
              ) : (
                visiblePOs.map((po) => {
                  const invoiceStatus = getInvoicingStatus(po.id);
                  const summary = poSummaries[po.id];
                  
                  return (
                  <tr key={po.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(po.id)}
                        onChange={() => toggleSelectRow(po.id)}
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap text-left">
                      <div className="flex items-center space-x-2">
                        <span>{po.id}</span>
                        {invoiceStatus.status === 'Partially Invoiced' && (
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 text-blue-500" title="Invoice in Progress" />
                          </div>
                        )}
                        {invoiceStatus.status === 'Fully Invoiced' && (
                          <div className="flex items-center">
                            <DollarSign className="w-3 h-3 text-green-500" title="Fully Invoiced" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(po.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap text-left">
                      <div className="max-w-xs truncate">{po.supplier}</div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {po.currency} {po.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusClass(po.status)}`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap hidden md:table-cell">
                      <div className="flex flex-col items-center space-y-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          invoiceStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                          invoiceStatus.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {invoiceStatus.status}
                        </span>
                        {invoiceStatus.percentage > 0 && (
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                invoiceStatus.color === 'green' ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${invoiceStatus.percentage}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap hidden sm:table-cell">
                      {summary ? (
                        <div className="text-center">
                          <div className="font-medium">
                            {formatCurrency(summary.remaining_amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            of {formatCurrency(summary.po_total_amount)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap hidden lg:table-cell">
                      {po.items}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap relative">
                      <div className="flex justify-center">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => toggleDropdown(po.id, e)}
                        >
                          <Ellipsis className="h-5 w-5" />
                        </button>
                        
                        {activeDropdown === po.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200"
                          >
                            <div className="py-1">
                              {/* Always available actions */}
                              <button
                                onClick={() => handleView(po)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </button>
                              
                              {/* Edit - Only for non-cancelled POs */}
                              {po.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleEdit(po)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </button>
                              )}

                              {/* Cancel/Delete actions based on status */}
                              {po.status !== 'Cancelled' ? (
                                // For active POs - show Cancel option
                                <button
                                  onClick={() => handleCancel(po)}
                                  className="flex items-center px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 w-full text-left"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel
                                </button>
                              ) : (
                                // For cancelled POs - show Restore and Permanent Delete
                                <>
                                  <button
                                    onClick={() => handleRestore(po)}
                                    className="flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 w-full text-left"
                                  >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Restore
                                  </button>
                                  <div className="border-t border-gray-100 my-1"></div>
                                  <button
                                    onClick={() => handlePermanentDelete(po)}
                                    className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Permanent Delete
                                  </button>
                                </>
                              )}

                              {/* Other actions - always available */}
                              <div className="border-t border-gray-100 my-1"></div>
                              <button
                                onClick={() => handlePrint(po)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                              </button>
                              <button
                                onClick={() => handleDownload(po)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </button>
                              <button
                                onClick={() => handleViewHistory(po)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <History className="w-4 h-4 mr-2" />
                                View History
                              </button>

                              {/* Duplicate - Only for non-cancelled POs */}
                              {po.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleDuplicate(po)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicate
                                </button>
                              )}
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
      {filteredPOs.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-200 bg-white gap-3">
          <div className="text-sm text-gray-700">
            <div>Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredPOs.length)} of {filteredPOs.length} purchase orders</div>
            <div className="text-xs text-gray-500 mt-1">Page {currentPage} of {totalPages}</div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="First page"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {(() => {
              const maxVisiblePages = 5;
              const pages = [];
              
              if (totalPages <= maxVisiblePages) {
                // Show all pages if total is 5 or less
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // Calculate the range of pages to show
                let startPage, endPage;
                
                if (currentPage <= 3) {
                  // Show pages 1-5 when current page is in the beginning
                  startPage = 1;
                  endPage = maxVisiblePages;
                } else if (currentPage >= totalPages - 2) {
                  // Show last 5 pages when current page is near the end
                  startPage = totalPages - maxVisiblePages + 1;
                  endPage = totalPages;
                } else {
                  // Show current page in the middle with 2 pages on each side
                  startPage = currentPage - 2;
                  endPage = currentPage + 2;
                }
                
                // Add first page and ellipsis if needed
                if (startPage > 1) {
                  pages.push(1);
                  if (startPage > 2) {
                    pages.push('...');
                  }
                }
                
                // Add the main range of pages
                for (let i = startPage; i <= endPage; i++) {
                  if (i > 0 && i <= totalPages) {
                    pages.push(i);
                  }
                }
                
                // Add ellipsis and last page if needed
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push('...');
                  }
                  pages.push(totalPages);
                }
              }
              
              return pages.map((page, index) => {
                if (page === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-3 py-1 text-sm text-gray-500"
                    >
                      ...
                    </span>
                  );
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      currentPage === page
                        ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                    } border`}
                  >
                    {page}
                  </button>
                );
              });
            })()}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Last page"
            >
              Last
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showEditModal && <EditPOModal />}
      {showHistoryModal && <HistoryModal />}
    </div>
  );
};

export default PurchaseOrderTable;