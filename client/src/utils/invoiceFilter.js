// invoiceFilter.js
// Pure utility to filter and sort invoices for use by InvoiceTable

function filterInvoices(invoicesData = [], activeTab = 'All', filters = {}, searchTerm = '') {
  let filtered = Array.isArray(invoicesData) ? invoicesData.slice() : [];

  // If we're not in the Overdue tab, exclude any invoices that are Overdue
  if (activeTab !== 'Overdue') {
    filtered = filtered.filter(inv => inv.status !== 'Overdue');
  }

  // Tab-based filtering
  if (activeTab === 'PO Invoices') {
    filtered = filtered.filter(inv => inv.invoice_type === 'po_invoice');
  } else if (activeTab === 'All') {
    // For "All" tab, show ALL invoices (including PO invoices)
    // No filtering needed - show everything except overdue (already filtered above)
  } else if (activeTab === 'Overdue') {
    filtered = filtered.filter(inv => inv.status === 'Overdue');
  } else if (activeTab === 'Not Sent') {
    // "Not Sent" tab includes both "Not Sent" and "Draft" statuses
    filtered = filtered.filter(inv => inv.status === 'Not Sent' || inv.status === 'Draft');
  } else if (activeTab !== 'All') {
    // Other status-specific tabs (Paid, Pending, Sent, etc.)
    filtered = filtered.filter(inv => inv.status === activeTab);
  }

  // Search term filtering (client-side quick search)
  if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim() !== '') {
    const s = searchTerm.toLowerCase();
    filtered = filtered.filter(inv =>
      (inv.customer_name || '').toLowerCase().includes(s) ||
      (inv.supplier_name || '').toLowerCase().includes(s) ||
      (String(inv.invoice_number || '')).toLowerCase().includes(s)
    );
  }

  // Apply additional filters
  if (filters) {
    if (filters.customer && filters.customer.trim()) {
      const s = filters.customer.toLowerCase();
      filtered = filtered.filter(inv =>
        (inv.customer_name || '').toLowerCase().includes(s) ||
        (inv.supplier_name || '').toLowerCase().includes(s)
      );
    }

    if (filters.invoice_number && filters.invoice_number.trim()) {
      const s = filters.invoice_number.toLowerCase();
      filtered = filtered.filter(inv => (String(inv.invoice_number || '')).toLowerCase().includes(s));
    }

    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      if (!isNaN(from)) {
        // Normalize to local date-only (midnight) to avoid timezone issues
        const fromDateOnly = new Date(from.getFullYear(), from.getMonth(), from.getDate());
        filtered = filtered.filter(inv => {
          const invDateRaw = inv.bill_date || inv.invoice_date || null;
          const invDate = invDateRaw ? new Date(invDateRaw) : null;
          if (!invDate || isNaN(invDate)) return false;
          const invDateOnly = new Date(invDate.getFullYear(), invDate.getMonth(), invDate.getDate());
          return invDateOnly >= fromDateOnly;
        });
      }
    }

    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      if (!isNaN(to)) {
        // Normalize to local date-only (midnight) so the entire day is included
        const toDateOnly = new Date(to.getFullYear(), to.getMonth(), to.getDate());
        filtered = filtered.filter(inv => {
          const invDateRaw = inv.bill_date || inv.invoice_date || null;
          const invDate = invDateRaw ? new Date(invDateRaw) : null;
          if (!invDate || isNaN(invDate)) return false;
          const invDateOnly = new Date(invDate.getFullYear(), invDate.getMonth(), invDate.getDate());
          return invDateOnly <= toDateOnly;
        });
      }
    }

    if (filters.minAmount && !isNaN(parseFloat(filters.minAmount))) {
      const minA = parseFloat(filters.minAmount);
      filtered = filtered.filter(inv => {
        const amount = parseFloat(inv.total_amount || inv.invoice_amount || 0) || 0;
        return amount >= minA;
      });
    }

    if (filters.maxAmount && !isNaN(parseFloat(filters.maxAmount))) {
      const maxA = parseFloat(filters.maxAmount);
      filtered = filtered.filter(inv => {
        const amount = parseFloat(inv.total_amount || inv.invoice_amount || 0) || 0;
        return amount <= maxA;
      });
    }
  }

  // Sorting: status priority then date (latest first)
  const getStatusPriority = (status) => {
    switch (status) {
      case 'Sent': return 1;
      case 'Paid': return 1;
      case 'Overdue': return 2;
      case 'Pending': return 3;
      case 'Not Sent': return 4;
      case 'Draft': return 5;
      case 'Cancelled': return 6;
      default: return 7;
    }
  };

  const getDateForSorting = (invoice) => invoice.updated_at || invoice.created_at || invoice.bill_date || invoice.invoice_date || '';

  filtered.sort((a, b) => {
    const aP = getStatusPriority(a.status);
    const bP = getStatusPriority(b.status);
    if (aP !== bP) return aP - bP;
    const aDate = new Date(getDateForSorting(a));
    const bDate = new Date(getDateForSorting(b));
    return bDate - aDate;
  });

  return filtered;
}

module.exports = { filterInvoices };
