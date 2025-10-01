import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Download, Printer, Edit, Share2, Eye, EyeOff, X } from 'lucide-react';
import { generateInvoiceId, generateIncrementalPOInvoiceId } from '../utils/idGenerator';
import Logo from '../assets/Logo/Logo.png';

const PurchaseOrderDetails = ({ poId, onBack }) => {
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceHistory, setInvoiceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const poRef = useRef();

  // Fetch PO data from API
  useEffect(() => {
    const fetchPODetails = async () => {
      try {
        setLoading(true);
  console.debug('Fetching PO details for ID:', poId);
        
        const response = await fetch(`http://localhost:5000/api/purchase-orders/${poId}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
  console.debug('PO Details API Response:', data);
        
        // Transform API data to match component format
        const transformedPO = {
          id: data.id, // Keep the database ID
          databaseId: data.id, // Store database ID separately
          number: data.po_number || data.id,
          date: data.po_date,
          deliveryDate: data.delivery_date || new Date(Date.now() + 10*24*60*60*1000).toISOString().split('T')[0], // 10 days from PO date
          supplier: {
            name: data.supplier_name || 'N/A',
            company: data.supplier_name || 'N/A',
            email: data.supplier_email || 'N/A',
            phone: data.supplier_phone || 'N/A', 
            address: data.supplier_address || 'N/A',
            taxId: 'STR-123456789', // Static for now
            ntn: '1234567-8' // Static for now
          },
          items: (data.items || []).map(item => ({
            id: item.id || item.item_no || 1,
            description: item.description || 'N/A',
            quantity: item.quantity || 0,
            unit: item.unit || 'pcs',
            unitPrice: item.unit_price || item.unitPrice || 0,
            total: item.amount || item.total || 0
          })),
          subtotal: data.subtotal || 0,
          taxRate: data.tax_rate || 0,
          taxAmount: data.tax_amount || 0,
          totalAmount: data.total_amount || 0,
          currency: data.currency || 'PKR',
          status: data.status || 'Pending',
          termsAndConditions: data.terms_conditions || 'Payment within 30 days of delivery. Quality as per approved sample. Delivery at buyer\'s warehouse.',
          notes: data.notes || '',
          createdBy: 'System User', // Static for now
          approvedBy: data.status === 'Approved' ? 'Manager' : null,
          paymentHistory: [] // Static empty for now
        };
        
        setPurchaseOrder(transformedPO);
        setError(null);
        
      } catch (error) {
        console.error('Error fetching PO details:', error);
        setError(error.message);
        
        // Create a safe fallback PO with proper default values
        const fallbackPO = {
          id: poId,
          number: poId,
          date: new Date().toISOString().split('T')[0],
          deliveryDate: new Date(Date.now() + 10*24*60*60*1000).toISOString().split('T')[0],
          supplier: {
            name: 'Supplier Not Found',
            company: 'N/A',
            email: 'N/A',
            phone: 'N/A',
            address: 'N/A',
            taxId: 'N/A',
            ntn: 'N/A'
          },
          items: [],
          subtotal: 0,
          taxRate: 0,
          taxAmount: 0,
          totalAmount: 0,
          currency: 'PKR',
          status: 'Pending',
          termsAndConditions: 'No terms available',
          notes: 'Error loading purchase order details',
          createdBy: 'System',
          approvedBy: null,
          paymentHistory: []
        };
        
        setPurchaseOrder(fallbackPO);
      }
      setLoading(false);
    };
    
    fetchPODetails();
  }, [poId]);

  // Fetch invoice and payment history for this PO
  const fetchInvoiceHistory = async () => {
    if (!purchaseOrder?.number) return;
    
    try {
      setLoadingHistory(true);
      const response = await fetch(`http://localhost:5000/api/purchase-orders/${purchaseOrder.number}/invoices`);
      if (response.ok) {
        const invoices = await response.json();
        setInvoiceHistory(invoices);
      } else {
        console.error('Failed to fetch invoice history');
        setInvoiceHistory([]);
      }
    } catch (error) {
      console.error('Error fetching invoice history:', error);
      setInvoiceHistory([]);
    }
    setLoadingHistory(false);
  };

  // Fetch PO summary data from server
  const [poSummary, setPOSummary] = useState({
    poTotal: 0,
    totalInvoiced: 0,
    remainingAmount: 0,
    invoicingPercentage: 0,
    invoiceCount: 0,
    status: 'Not Invoiced'
  });

  // Currency formatter helper
  const formatCurrency = (amount, currency) => {
    const curr = currency || (purchaseOrder && purchaseOrder.currency) || 'PKR';
    const num = Number(amount || 0);
    // Use toLocaleString for thousands separators
    return `${curr} ${num.toLocaleString()}`;
  };

  const fetchPOSummary = async () => {
    if (!poId) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/purchase-orders/${poId}/summary`);
      if (response.ok) {
        const summary = await response.json();
        const invoicingPercentage = summary.po_total > 0 ? (summary.total_invoiced / summary.po_total) * 100 : 0;
        
        setPOSummary({
          poTotal: summary.po_total || 0,
          totalInvoiced: summary.total_invoiced || 0,
          remainingAmount: summary.remaining_amount || 0,
          invoicingPercentage: Math.round(invoicingPercentage * 100) / 100,
          invoiceCount: summary.invoice_count || 0,
          status: summary.remaining_amount <= 0 ? 'Fully Invoiced' : 
                  summary.total_invoiced > 0 ? 'Partially Invoiced' : 'Not Invoiced'
        });
        
        console.debug('PO Summary updated:', {
          remaining: summary.remaining_amount,
          total_invoiced: summary.total_invoiced,
          po_total: summary.po_total
        });
      } else {
        console.error('Failed to fetch PO summary');
      }
    } catch (error) {
      console.error('Error fetching PO summary:', error);
    }
  };

  // Legacy function for backward compatibility
  const getPOSummary = () => {
    return poSummary;
  };

  // Fetch PO summary and invoice history when PO ID is loaded
  useEffect(() => {
    if (poId) {
      fetchPOSummary();
      fetchInvoiceHistory();
    }
  }, [poId]);

  // Refresh PO summary when showing payment history
  useEffect(() => {
    if (showPaymentHistory && poId) {
      fetchPOSummary();
      fetchInvoiceHistory();
    }
  }, [showPaymentHistory]);

  // Update invoice status (e.g., mark as paid)
  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/po-invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          payment_date: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : null
        })
      });

      if (response.ok) {
        // Refresh the invoice history to show updated status
        await fetchInvoiceHistory();
        
        const statusMessage = newStatus === 'Paid' ? 'marked as paid' : `updated to ${newStatus}`;
        alert(`Invoice successfully ${statusMessage}!`);
      } else {
        throw new Error('Failed to update invoice status');
      }
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('Failed to update invoice status. Please try again.');
    }
  };

  const generatePDF = () => {
    if (!purchaseOrder) return;
    
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups for this site to generate PDF.');
      return;
    }

    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Purchase Order ${purchaseOrder.number}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: white;
            color: #333;
            line-height: 1.5;
            padding: 20px;
          }
          
          .po-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e5e5e5;
          }
          
          .company-info {
            display: block;
            align-items: center;
            gap: 20px;
          }
          
          .company-logo {
            width: 15rem;
            padding-bottom: 20px;
          }
          
          .company-details h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
          }
          
          .company-details p {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 3px;
          }
          
          .po-meta {
            text-align: right;
          }
          
          .po-title {
            font-size: 24px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 8px;
          }
          
          .po-info {
            background: #f8fafc;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          
          .po-info div {
            margin-bottom: 4px;
            font-size: 12px;
          }
          
          .po-info .label {
            font-weight: 600;
            color: #374151;
          }
          
          .section {
            margin-bottom: 30px;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e5e5;
          }
          
          .supplier-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          
          .supplier-info h3 {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 12px;
          }
          
          .supplier-info p {
            font-size: 13px;
            color: #4b5563;
            margin-bottom: 4px;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          .items-table th,
          .items-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e5e5;
          }
          
          .items-table th {
            background: #f8fafc;
            font-weight: 600;
            color: #374151;
            font-size: 13px;
          }
          
          .items-table td {
            font-size: 13px;
            color: #4b5563;
          }
          
          .items-table .text-right {
            text-align: right;
          }
          
          .summary-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
          }
          
          .summary-table {
            width: 300px;
          }
          
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          
          .summary-row.total {
            border-bottom: 2px solid #1976d2;
            border-top: 2px solid #1976d2;
            font-weight: bold;
            font-size: 16px;
            color: #1976d2;
            padding: 12px 0;
          }
          
          .terms {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          
          .terms h4 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #374151;
          }
          
          .terms p {
            font-size: 13px;
            color: #4b5563;
            line-height: 1.6;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }
          
          @media print {
            body { margin: 0; padding: 10px; }
            .po-container { margin: 0; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="po-container">
          <div class="header">
            <div class="company-info">
              <img src="${Logo}" alt="Company Logo" class="company-logo">
              <div class="company-details">
                <h2>A Rauf Brother Textile</h2>
                <p>Room No.205 Floor Saleha Chamber, Plot No. 8-9/C-1 Site, Karachi</p>
                <p>Email: contact@araufbrother.com | Phone: 021-36404043</p>
                <p><strong>S.T. Reg.No:</strong> 3253255666541 | <strong>NTN:</strong> 7755266214-8</p>
              </div>
            </div>
            <div class="po-meta">
              <div class="po-title">PURCHASE ORDER</div>
              <div class="po-info">
                <div><span class="label">PO Number:</span> ${purchaseOrder.number}</div>
                <div><span class="label">Date:</span> ${new Date(purchaseOrder.date).toLocaleDateString()}</div>
                <div><span class="label">Delivery Date:</span> ${new Date(purchaseOrder.deliveryDate).toLocaleDateString()}</div>
                <div><span class="label">Status:</span> ${purchaseOrder.status}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Supplier Information</div>
            <div class="supplier-info">
              <h3>${purchaseOrder.supplier.name}</h3>
              <p><strong>Company:</strong> ${purchaseOrder.supplier.company}</p>
              <p><strong>Email:</strong> ${purchaseOrder.supplier.email}</p>
              <p><strong>Phone:</strong> ${purchaseOrder.supplier.phone}</p>
              <p><strong>Address:</strong> ${purchaseOrder.supplier.address}</p>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Order Details</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="text-right">Qty</th>
                  <th class="text-right">Unit</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${(purchaseOrder.items || []).length > 0 ? 
                  purchaseOrder.items.map(item => `
                    <tr>
                      <td>${item.description || 'N/A'}</td>
                      <td class="text-right">${item.quantity || 0}</td>
                      <td class="text-right">${item.unit || 'pcs'}</td>
                      <td class="text-right">${formatCurrency(item.unitPrice || item.unit_price || 0, purchaseOrder.currency)}</td>
                      <td class="text-right">${formatCurrency(item.total || item.amount || 0, purchaseOrder.currency)}</td>
                    </tr>
                  `).join('') :
                  '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">No items found</td></tr>'
                }
              </tbody>
            </table>
          </div>
          
          <div class="summary-section">
            <div class="summary-table">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>${formatCurrency(purchaseOrder.subtotal, purchaseOrder.currency)}</span>
              </div>
              <div class="summary-row">
                <span>Tax (${purchaseOrder.taxRate}%)</span>
                <span>${formatCurrency(purchaseOrder.taxAmount, purchaseOrder.currency)}</span>
              </div>
              <div class="summary-row total">
                <span>Total Amount</span>
                <span>${formatCurrency(purchaseOrder.totalAmount, purchaseOrder.currency)}</span>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="terms">
              <h4>Terms and Conditions</h4>
              <p>${purchaseOrder.termsAndConditions}</p>
              ${purchaseOrder.notes ? `
                <h4 style="margin-top: 15px;">Special Notes</h4>
                <p>${purchaseOrder.notes}</p>
              ` : ''}
            </div>
          </div>
          

        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Purchase Order ${purchaseOrder.number}`,
        text: `Purchase Order details for ${purchaseOrder.supplier.name}`,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Function to fetch existing PO invoices for this specific PO (for incremental numbering)
  const fetchPOInvoicesForCurrentPO = async () => {
    try {
      // Use database ID if available, otherwise use the poId (which might be PO number)
      const searchId = purchaseOrder?.databaseId || purchaseOrder?.id || poId;
      const response = await fetch(`http://localhost:5000/api/po-invoices/details?po_id=${searchId}`);
      if (response.ok) {
        const data = await response.json();
  console.debug(`Fetched ${data.length} existing invoices for PO ${searchId}`);
        return data;
      } else {
        console.error('Failed to fetch PO invoices for current PO, using empty array for ID generation');
        return [];
      }
    } catch (error) {
      console.error('Error fetching PO invoices for current PO, using empty array for ID generation:', error);
      return []; // Return empty array on error, will still generate a unique ID
    }
  };

  // Function to fetch all PO invoice numbers for unique ID generation
  const fetchPOInvoiceNumbers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/po-invoices');
      if (response.ok) {
        const invoiceNumbers = await response.json();
  console.debug('Fetched PO invoice numbers for ID generation:', invoiceNumbers.length, 'existing invoice numbers');
        
        // Server returns array of strings, convert to format expected by ID generator
        // ID generator expects array of objects with invoice_number property
        const formattedData = invoiceNumbers.map(number => ({ invoice_number: number }));
        
  console.debug('Formatted for ID Generator:', formattedData.length, 'invoice objects');
        
        return formattedData;
      } else {
        console.error('Failed to fetch PO invoice numbers, using empty array for ID generation');
        return [];
      }
    } catch (error) {
      console.error('Error fetching PO invoice numbers, using empty array for ID generation:', error);
      return []; // Return empty array on error, will still generate a unique ID
    }
  };

  // Invoice Modal Component
  const InvoiceModal = () => {
    const [invoiceData, setInvoiceData] = useState({
      invoiceNumber: '', // Will be generated after fetching existing invoices
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], // 30 days from now
      supplier: {
        name: purchaseOrder?.supplier?.name || '',
        email: purchaseOrder?.supplier?.email || '',
        phone: purchaseOrder?.supplier?.phone || '',
        address: purchaseOrder?.supplier?.address || ''
      },
      items: purchaseOrder?.items?.map(item => ({
        description: item.description || 'N/A',
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || item.unit_price || 0,
        amount: item.total || item.amount || 0
      })) || [],
      subtotal: purchaseOrder?.subtotal || 0,
      taxRate: purchaseOrder?.taxRate || 0,
      taxAmount: purchaseOrder?.taxAmount || 0,
      total: purchaseOrder?.totalAmount || 0,
      invoiceAmount: 0, // Will be set to remaining amount
      remainingAmount: 0, // Will be calculated
      notes: `Generated from Purchase Order: ${purchaseOrder?.number || ''}`,
      po_id: purchaseOrder?.databaseId || purchaseOrder?.id || poId // Link to PO with database ID
    });

    // Initialize invoice amount with remaining amount when PO summary is loaded
    useEffect(() => {
      if (poSummary.remainingAmount > 0) {
        setInvoiceData(prev => ({
          ...prev,
          invoiceAmount: poSummary.remainingAmount,
          subtotal: poSummary.remainingAmount,
          total: poSummary.remainingAmount,
          remainingAmount: 0 // Will be 0 after this invoice
        }));
      }
    }, [poSummary.remainingAmount]);

    // Generate unique incremental PO invoice number on component mount
    useEffect(() => {
      const generateUniquePOInvoiceNumber = async () => {
        try {
          // Fetch existing invoices for this specific PO
          const existingPOInvoices = await fetchPOInvoicesForCurrentPO();
          // Fetch all PO invoices for collision checking
          const allPOInvoices = await fetchPOInvoiceNumbers();
          
          // Generate incremental ID (PI25-001, PI25-001-1, PI25-001-2, etc.)
          const newInvoiceNumber = generateIncrementalPOInvoiceId(existingPOInvoices, allPOInvoices);
          
          console.debug(`Generated PO invoice number for PO ${poId}:`, newInvoiceNumber);
          console.debug(`- Existing invoices for this PO: ${existingPOInvoices.length}`);
          console.debug(`- Total PO invoices in system: ${allPOInvoices.length}`);
          
          setInvoiceData(prev => ({
            ...prev,
            invoiceNumber: newInvoiceNumber
          }));
        } catch (error) {
          console.error('Error generating PO invoice number:', error);
          // Fallback: generate with empty arrays
          const fallbackNumber = generateIncrementalPOInvoiceId([], []);
          console.debug('Using fallback PO invoice number:', fallbackNumber);
          setInvoiceData(prev => ({
            ...prev,
            invoiceNumber: fallbackNumber
          }));
        }
      };
      
      generateUniquePOInvoiceNumber();
    }, []); // Only run once on mount

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setInvoiceData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSupplierChange = (e) => {
      const { name, value } = e.target;
      setInvoiceData(prev => ({
        ...prev,
        supplier: {
          ...prev.supplier,
          [name]: value
        }
      }));
    };

    // Items are now read-only since they come from PO
    // Only the invoice amount can be changed to control partial invoicing



    const handleInvoiceAmountChange = (e) => {
      const invoiceAmount = parseFloat(e.target.value) || 0;
      
      // Use current PO summary data
      const availableAmount = poSummary.remainingAmount;
      
      // Ensure invoice amount doesn't exceed available amount
      const validInvoiceAmount = Math.min(invoiceAmount, availableAmount);
      const newRemainingAmount = Math.max(0, availableAmount - validInvoiceAmount);
      
      // Use the invoice amount directly (tax already included in PO total)
      setInvoiceData(prev => ({
        ...prev,
        invoiceAmount: validInvoiceAmount,
        remainingAmount: newRemainingAmount,
        subtotal: validInvoiceAmount, // Invoice amount is the total including tax
        taxAmount: 0, // No additional tax since it's already in the PO total
        total: validInvoiceAmount,
        // Show warning if user entered more than available
        exceedsAvailable: invoiceAmount > availableAmount
      }));
    };

    const handleCreateInvoice = async () => {
      try {
        // Prepare invoice data for backend
        const invoicePayload = {
          invoice_number: invoiceData.invoiceNumber,
          invoice_date: invoiceData.invoiceDate,
          due_date: invoiceData.dueDate,
          po_id: purchaseOrder?.databaseId || purchaseOrder?.id, // Use database ID
          po_number: purchaseOrder?.number,
          customer_name: invoiceData.supplier.name, // Use customer_name to match DB field
          customer_email: invoiceData.supplier.email,
          customer_phone: invoiceData.supplier.phone,
          customer_address: invoiceData.supplier.address,
          subtotal: invoiceData.subtotal,
          tax_rate: invoiceData.taxRate,
          tax_amount: invoiceData.taxAmount,
          total_amount: invoiceData.invoiceAmount,
          currency: purchaseOrder?.currency || 'PKR',
          status: 'Draft',
          notes: invoiceData.notes,
          items: invoiceData.items.filter(item => item.description && item.quantity > 0)
        };

  console.debug('Creating invoice:', invoicePayload);
        
        // Save to backend (you'll need to create this endpoint)
        const response = await fetch('http://localhost:5000/api/po-invoices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(invoicePayload)
        });

        if (response.ok) {
          const result = await response.json();
          
          // Refresh PO summary to get updated remaining amount
          await fetchPOSummary();
          
          // Refresh invoice history to show the new invoice
          await fetchInvoiceHistory();
          
          alert(`Invoice ${invoiceData.invoiceNumber} created successfully!\nInvoice Amount: PKR ${invoiceData.invoiceAmount.toLocaleString()}\nRemaining PO Amount: PKR ${invoiceData.remainingAmount.toLocaleString()}`);
          setShowInvoiceModal(false);
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Failed to create invoice' }));
          throw new Error(errorData.message || 'Failed to create invoice');
        }
      } catch (error) {
        console.error('Error creating invoice:', error);
        alert(`Error creating invoice: ${error.message}\n\nPlease try again.`);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Create Invoice from PO</h2>
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Invoice Basic Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                <input
                  type="text"
                  name="invoiceNumber"
                  value={invoiceData.invoiceNumber || 'Generating...'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
                <input
                  type="date"
                  name="invoiceDate"
                  value={invoiceData.invoiceDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={invoiceData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* PO Information & Invoice Amount */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-blue-800">Purchase Order Information</h4>
                {(() => {
                  const poSummary = getPOSummary();
                  return (
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        poSummary.status === 'Fully Invoiced' ? 'bg-green-100 text-green-800' :
                        poSummary.status === 'Partially Invoiced' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {poSummary.status}
                      </span>
                      <span className="text-xs text-blue-600 font-medium">
                        {poSummary.invoicingPercentage.toFixed(1)}% Invoiced
                      </span>
                    </div>
                  );
                })()}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-blue-700 mb-2">PO Number</label>
                    <input
                      type="text"
                      value={purchaseOrder?.number || ''}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-blue-25 text-blue-800"
                      readOnly
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-blue-700 mb-2">PO Total Amount</label>
                    <input
                      type="text"
                      value={`PKR ${(purchaseOrder?.totalAmount || 0).toLocaleString()}`}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-blue-25 text-blue-800"
                      readOnly
                    />
                  </div>
                  {(() => {
                    const poSummary = getPOSummary();
                    return (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-blue-700 mb-2">Already Invoiced</label>
                        <input
                          type="text"
                          value={`PKR ${poSummary.totalInvoiced.toLocaleString()}`}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-orange-25 text-orange-800"
                          readOnly
                        />
                      </div>
                    );
                  })()}
                </div>
                <div>
                  {(() => {
                    const poSummary = getPOSummary();
                    const availableAmount = poSummary.remainingAmount;
                    
                    return (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-green-700 mb-2">Available to Invoice</label>
                          <input
                            type="text"
                            value={`PKR ${availableAmount.toLocaleString()}`}
                            className="w-full px-3 py-2 border border-green-300 rounded-lg bg-green-25 text-green-800"
                            readOnly
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-blue-700 mb-2">
                            Invoice Amount * (This controls the total invoice value)
                          </label>
                          <p className="text-xs text-blue-600 mb-2">
                            💡 Enter the amount you want to invoice from this PO. You can create partial invoices.
                          </p>
                          <input
                            type="number"
                            value={invoiceData.invoiceAmount}
                            onChange={handleInvoiceAmountChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              invoiceData.exceedsAvailable ? 'border-red-300 bg-red-50' : 'border-blue-300'
                            }`}
                            min="0"
                            max={availableAmount}
                            step="0.01"
                            placeholder="Enter amount to invoice"
                          />
                          {invoiceData.exceedsAvailable && (
                            <div className="text-xs text-red-600 mt-1">
                              ⚠️ Amount exceeds available balance. Maximum allowed: PKR {availableAmount.toLocaleString()}
                            </div>
                          )}
                          <div className="text-xs text-green-600 mt-1">
                            After this invoice, remaining: PKR {(() => {
                              const summary = getPOSummary();
                              return (summary.remainingAmount - (invoiceData.invoiceAmount || 0)).toLocaleString();
                            })()}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Supplier Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                  <input
                    type="text"
                    name="name"
                    value={invoiceData.supplier.name}
                    onChange={handleSupplierChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={invoiceData.supplier.email}
                    onChange={handleSupplierChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={invoiceData.supplier.phone}
                    onChange={handleSupplierChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={invoiceData.supplier.address}
                    onChange={handleSupplierChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Items Table - Read Only */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Invoice Items (From Purchase Order)</h4>
              <p className="text-sm text-gray-600 mb-3">
                ℹ️ Items are from the Purchase Order and cannot be modified
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Description</th>
                      <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">Quantity</th>
                      <th className="border border-gray-300 px-3 py-2 text-right text-sm font-medium">Unit Price</th>
                      <th className="border border-gray-300 px-3 py-2 text-right text-sm font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item, index) => (
                      <tr key={index} className="bg-gray-100">
                        <td className="border border-gray-300 px-3 py-2">
                          <div className="px-2 py-1 text-gray-700 bg-gray-100 rounded">
                            {item.description}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-center">
                          <div className="px-2 py-1 text-gray-700 bg-gray-100 rounded text-center">
                            {item.quantity}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right">
                          <div className="px-2 py-1 text-gray-700 bg-gray-100 rounded text-right">
                            {(item.unitPrice || 0).toLocaleString('en-PK', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-right font-medium">
                          PKR {(item.amount || 0).toLocaleString('en-PK', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Totals */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-4 text-lg">Purchase Order Invoice Summary</h4>
              <div className="space-y-3">
                {/* Total PO Amount */}
                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="font-medium text-gray-700">Total PO Amount:</span>
                  <span className="font-bold text-lg">PKR {(purchaseOrder?.totalAmount || 0).toLocaleString('en-PK')}/-</span>
                </div>
                
                {/* Total Invoice Amount */}
                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="font-medium text-blue-700">Total Invoice Amount:</span>
                  <span className="font-bold text-lg text-blue-600">PKR {(invoiceData.invoiceAmount || 0).toLocaleString('en-PK')}/-</span>
                </div>
                
                {/* Remaining Amount */}
                <div className="flex justify-between items-center py-2 bg-green-50 px-4 rounded-md border border-green-200">
                  <span className="font-medium text-green-700">Remaining Amount:</span>
                  <span className="font-bold text-lg text-green-600">
                    PKR {((purchaseOrder?.totalAmount || 0) - (invoiceData.invoiceAmount || 0)).toLocaleString('en-PK')}/-
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={invoiceData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes or terms..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateInvoice}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading purchase order...</span>
      </div>
    );
  }

  if (!purchaseOrder) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Purchase order not found</p>
        <button 
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Purchase Orders</span>
          </button>
        </div>
        
        <div className="flex gap-2">
          {/* Only show Make Invoice button if PO is not fully invoiced */}
          {poSummary.remainingAmount > 0 && (
            <button
              onClick={async () => {
                // Refresh PO summary and fetch latest invoice history before opening modal
                setLoadingHistory(true);
                await fetchPOSummary();
                await fetchInvoiceHistory();
                setLoadingHistory(false);
                setShowInvoiceModal(true);
              }}
              disabled={loadingHistory}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingHistory ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  <span>Make Invoice</span>
                </>
              )}
            </button>
          )}
          
          {/* Show fully invoiced message when PO is complete */}
          {poSummary.remainingAmount <= 0 && poSummary.totalInvoiced > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span>Fully Invoiced</span>
            </div>
          )}
          <button
            onClick={() => setShowPaymentHistory(!showPaymentHistory)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            {showPaymentHistory ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showPaymentHistory ? 'Hide' : 'Show'} Invoice & Payment History</span>
          </button>

          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

        </div>
      </div>

      {/* Purchase Order Content */}
      <div ref={poRef} className="p-4 sm:p-6">
        {/* Company Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b-2 border-gray-200">
          <div className="flex flex-col gap-5">
            <div className="w-[15rem] flex-shrink-0">
              <img src={Logo} alt="Company Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">A Rauf Brother Textile</h2>
              <p className="text-sm text-gray-600">Room No.205 Floor Saleha Chamber, Plot No. 8-9/C-1 Site, Karachi</p>
              <p className="text-sm text-gray-600">Email: contact@araufbrother.com | Phone: 021-36404043</p>
              <p className="text-sm text-gray-600"><strong>S.T. Reg.No:</strong> 3253255666541 | <strong>NTN:</strong> 7755266214-8</p>
            </div>
          </div>
          
          <div className="text-right">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">PURCHASE ORDER</h1>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="mb-2"><span className="font-semibold">PO Number:</span> {purchaseOrder.number}</div>
              <div className="mb-2"><span className="font-semibold">Date:</span> {new Date(purchaseOrder.date).toLocaleDateString()}</div>
              <div className="mb-2"><span className="font-semibold">Delivery Date:</span> {new Date(purchaseOrder.deliveryDate).toLocaleDateString()}</div>
              <div>
                <span className="font-semibold">Status:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                  purchaseOrder.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                  purchaseOrder.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                  purchaseOrder.status === 'In Transit' ? 'bg-purple-100 text-purple-800' :
                  purchaseOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {purchaseOrder.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Supplier Information</h3>
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">{purchaseOrder.supplier.name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1"><strong>Company:</strong> {purchaseOrder.supplier.company}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {purchaseOrder.supplier.email}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Phone:</strong> {purchaseOrder.supplier.phone}</p>
                <p className="text-sm text-gray-600"><strong>Address:</strong> {purchaseOrder.supplier.address}</p>
              </div>

            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Order Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-900">Qty</th>
                  <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-900">Unit</th>
                  <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-900">Unit Price</th>
                  <th className="border border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-900">Total</th>
                </tr>
              </thead>
              <tbody>
                {(purchaseOrder.items || []).length > 0 ? (
                  purchaseOrder.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{item.description || 'N/A'}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900 text-right">{item.quantity || 0}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900 text-right">{item.unit || 'pcs'}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900 text-right">
                        {purchaseOrder.currency} {(item.unitPrice || item.unit_price || 0).toLocaleString()}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                        {purchaseOrder.currency} {(item.total || item.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="border border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                      No items found for this purchase order
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-sm">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Subtotal</span>
                <span className="text-sm font-semibold text-gray-900">{purchaseOrder.currency} {purchaseOrder.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Tax ({purchaseOrder.taxRate}%)</span>
                <span className="text-sm font-semibold text-gray-900">{purchaseOrder.currency} {purchaseOrder.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-blue-600">
                <span className="text-lg font-bold text-blue-600">Total Amount</span>
                <span className="text-lg font-bold text-blue-600">{purchaseOrder.currency} {purchaseOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice & Payment History */}
        {showPaymentHistory && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">Invoice & Payment History</h3>
              <button
                onClick={fetchInvoiceHistory}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                disabled={loadingHistory}
              >
                {loadingHistory ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            
            {loadingHistory ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Loading history...</span>
              </div>
            ) : invoiceHistory.length > 0 ? (
              <div className="space-y-4">
                {/* Enhanced Summary Card */}
                {(() => {
                  const summary = getPOSummary();
                  return (
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-blue-800 mb-1">PO Total Amount</p>
                          <p className="text-xl font-bold text-blue-600">PKR {summary.poTotal.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-green-800 mb-1">Total Invoiced</p>
                          <p className="text-xl font-bold text-green-600">PKR {summary.totalInvoiced.toLocaleString()}</p>
                          <p className="text-xs text-green-500">{summary.invoicingPercentage}% of PO</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-orange-800 mb-1">Remaining to Invoice</p>
                          <p className="text-xl font-bold text-orange-600">PKR {summary.remainingAmount.toLocaleString()}</p>
                          <p className="text-xs text-orange-500">{(100 - summary.invoicingPercentage).toFixed(2)}% remaining</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-purple-800 mb-1">Invoice Count</p>
                          <p className="text-xl font-bold text-purple-600">{summary.invoiceCount}</p>
                          <p className="text-xs text-purple-500">{summary.invoiceCount > 1 ? 'Multiple invoices' : summary.invoiceCount === 1 ? 'Single invoice' : 'No invoices'}</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-800 mb-1">Status</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            summary.status === 'Fully Invoiced' ? 'bg-green-100 text-green-800' :
                            summary.status === 'Partially Invoiced' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {summary.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-gray-700">Invoicing Progress</span>
                          <span className="text-xs font-medium text-gray-700">{summary.invoicingPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              summary.invoicingPercentage === 100 ? 'bg-green-500' : 
                              summary.invoicingPercentage > 50 ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min(summary.invoicingPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Invoice List */}
                {invoiceHistory.map((invoice, index) => (
                  <div key={invoice.id || index} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{invoice.invoice_number}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                            invoice.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                            invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {invoice.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="font-medium">Invoice Date:</p>
                            <p>{new Date(invoice.invoice_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Due Date:</p>
                            <p>{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="font-medium">Supplier:</p>
                            <p>{invoice.supplier_name || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          PKR {(parseFloat(invoice.invoice_amount || invoice.total_amount) || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(invoice.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Payment Information */}
                    {invoice.status === 'Paid' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium">Payment Completed</span>
                          <span className="text-gray-500">•</span>
                          <span>Full amount received</span>
                        </div>
                      </div>
                    )}

                    {invoice.status === 'Overdue' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-red-700">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="font-medium">Payment Overdue</span>
                          <span className="text-gray-500">•</span>
                          <span>
                            {invoice.due_date && new Date() > new Date(invoice.due_date) 
                              ? `${Math.ceil((new Date() - new Date(invoice.due_date)) / (1000 * 60 * 60 * 24))} days overdue`
                              : 'Payment pending'
                            }
                          </span>
                        </div>
                      </div>
                    )}

                    {invoice.status === 'Pending' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-orange-700">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="font-medium">Pending Payment</span>
                            <span className="text-gray-500">•</span>
                            <span>
                              {invoice.due_date 
                                ? `Due ${new Date(invoice.due_date).toLocaleDateString()}`
                                : 'No due date set'
                              }
                            </span>
                          </div>
                          <button
                            onClick={() => updateInvoiceStatus(invoice.id, 'Paid')}
                            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            Mark as Paid
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {invoice.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Notes:</span> {invoice.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 mb-2">No invoices created for this purchase order yet</p>
                <p className="text-sm text-gray-400">Click "Make Invoice" to create the first invoice</p>
              </div>
            )}
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="mb-8">
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Terms and Conditions</h4>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{purchaseOrder.termsAndConditions}</p>
            
            {purchaseOrder.notes && (
              <>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Special Notes</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{purchaseOrder.notes}</p>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">This is a computer-generated purchase order and does not require a signature.</p>
          <p className="text-xs text-gray-500 mt-1">
            Created by {purchaseOrder.createdBy} • 
            {purchaseOrder.approvedBy && ` Approved by ${purchaseOrder.approvedBy} •`}
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {/* Invoice Modal */}
      {showInvoiceModal && <InvoiceModal />}
    </div>
  );
};

export default PurchaseOrderDetails;