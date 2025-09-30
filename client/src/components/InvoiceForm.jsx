import React, { useState, useEffect } from "react";

const InvoiceForm = ({ initialData, onSubmit, onCancel }) => {
  // State for customers from database
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [companySettings, setCompanySettings] = useState(null);

  // State for invoice items (multiple items support)
  const [invoiceItems, setInvoiceItems] = useState([{
    id: 1,
    description: "",
    quantity: "",
    rate: "",
    amount: 0
  }]);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    phone: "",
    a_p_Name: "",
    address: "",
    stRegNo: "",
    ntnNumber: "",
    currency: "PKR",
    salesTax: 17,
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    billDate: new Date().toISOString().split('T')[0], // Default to today
    paymentDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 15 days from now
    note: "",
  });

  // Fetch customers and company settings from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch customers
        const customersResponse = await fetch('http://localhost:5000/api/v1/customertable');
        if (customersResponse.ok) {
          const customersData = await customersResponse.json();
          setCustomers(customersData);
          setFilteredCustomers(customersData);
        } else {
          console.error('Failed to fetch customers');
        }

        // Fetch company settings
        const settingsResponse = await fetch('http://localhost:5000/api/company-settings');
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setCompanySettings(settingsData);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter customers based on search term
  useEffect(() => {
    if (searchTerm.length === 0) {
      setFilteredCustomers(customers);
      setShowDropdown(false);
    } else {
      const filtered = customers.filter(customer =>
        customer.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCustomers(filtered);
      setShowDropdown(filtered.length > 0 && searchTerm.length > 0);
    }
  }, [searchTerm, customers]);

  // Handle initial data for editing
  useEffect(() => {
    if (initialData) {
      // Populate form with existing invoice data
      setFormData({
        customerName: initialData.customer_name || initialData.customerName || '',
        customerEmail: initialData.customer_email || initialData.customerEmail || '',
        phone: initialData.customer_phone || initialData.phone || '',
        a_p_Name: initialData.a_p_Name || '',
        address: initialData.customer_address || initialData.address || '',
        stRegNo: initialData.stRegNo || '',
        ntnNumber: initialData.ntnNumber || '',
        currency: initialData.currency || 'PKR',
        salesTax: initialData.tax_rate || initialData.salesTax || 17,
        subtotal: initialData.subtotal || 0,
        taxAmount: initialData.tax_amount || initialData.taxAmount || 0,
        totalAmount: initialData.total_amount || initialData.totalAmount || 0,
        billDate: initialData.bill_date || initialData.billDate || new Date().toISOString().split('T')[0],
        paymentDeadline: initialData.payment_deadline || initialData.paymentDeadline || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        note: initialData.note || initialData.notes || '',
      });

      // Set search term to customer name for display
      setSearchTerm(initialData.customer_name || initialData.customerName || '');

      // Handle invoice items if they exist
      if (initialData.items && Array.isArray(initialData.items) && initialData.items.length > 0) {
        const mappedItems = initialData.items.map((item, index) => ({
          id: index + 1,
          description: item.description || item.item_name || '',
          quantity: item.quantity || '',
          rate: item.rate || item.unit_price || '',
          amount: item.amount || item.total || 0
        }));
        setInvoiceItems(mappedItems);
      } else if (initialData.item_name) {
        // Handle single item format
        setInvoiceItems([{
          id: 1,
          description: initialData.item_name,
          quantity: initialData.quantity || '',
          rate: initialData.rate || '',
          amount: initialData.total_amount || initialData.totalAmount || 0
        }]);
      }
    }
  }, [initialData]);

  // Handle customer selection from dropdown
  const handleCustomerSelect = (customer) => {
    setSearchTerm(customer.customer);
    setFormData((prev) => ({
      ...prev,
      customerName: customer.customer,
      customerEmail: customer.email,
      phone: customer.phone,
      a_p_Name: "", // Database doesn't have alternate phone, so keep empty
      address: customer.address,
      stRegNo: "", // Database doesn't have ST reg no, so keep empty
      ntnNumber: "", // Database doesn't have NTN number, so keep empty
    }));
    setShowDropdown(false);
  };

  // Check if customer exists in database
  const checkCustomerExists = (customerName) => {
    return customers.some(customer => 
      customer.customer.toLowerCase() === customerName.toLowerCase()
    );
  };

  // Handle input change for search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear customer data if search term is cleared
    if (value === '') {
      setFormData((prev) => ({
        ...prev,
        customerName: "",
        customerEmail: "",
        phone: "",
        a_p_Name: "",
        address: "",
        stRegNo: "",
        ntnNumber: "",
      }));
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (searchTerm.length > 0) {
      setShowDropdown(filteredCustomers.length > 0);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for click events
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  // Handle form data changes
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

  // Handle invoice item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // Calculate amount for this item
    if (field === 'quantity' || field === 'rate') {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const rate = parseFloat(updatedItems[index].rate) || 0;
      updatedItems[index].amount = quantity * rate;
    }

    setInvoiceItems(updatedItems);
  };

  // Add new item
  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      description: "",
      quantity: "",
      rate: "",
      amount: 0
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  // Remove item
  const removeItem = (index) => {
    if (invoiceItems.length > 1) {
      const updatedItems = invoiceItems.filter((_, i) => i !== index);
      setInvoiceItems(updatedItems);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if customer exists in database
    if (!checkCustomerExists(formData.customerName)) {
      alert("Customer not present. Kindly create new Customer first.");
      return;
    }

    if (!formData.customerName || !formData.customerEmail) {
      alert("Please fill in required customer information (Name and Email are required).");
      return;
    }

    // Validate that at least one item exists and has required fields
    const validItems = invoiceItems.filter(item => 
      item.description && item.quantity && item.rate
    );

    if (validItems.length === 0) {
      alert("Please add at least one item with description, quantity, and rate.");
      return;
    }

    // Validate required dates
    if (!formData.billDate) {
      alert("Bill Date is required.");
      return;
    }

    if (!formData.paymentDeadline) {
      alert("Payment Deadline is required.");
      return;
    }

    try {
      console.log("Submitting invoice with data:", { formData, invoiceItems }); // Debug log
      
      // Prepare invoice data
      const invoiceData = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        p_number: formData.phone,
        a_p_number: formData.a_p_Name,
        address: formData.address,
        st_reg_no: formData.stRegNo,
        ntn_number: formData.ntnNumber,
        currency: formData.currency,
        subtotal: parseFloat(formData.subtotal) || 0,
        tax_rate: parseFloat(formData.salesTax) || 17,
        tax_amount: parseFloat(formData.taxAmount) || 0,
        total_amount: parseFloat(formData.totalAmount) || 0,
        bill_date: formData.billDate,
        payment_deadline: formData.paymentDeadline,
        note: formData.note,
        status: "Pending",
        items: validItems.map((item, index) => ({
          item_no: index + 1,
          description: item.description,
          quantity: parseFloat(item.quantity) || 0,
          rate: parseFloat(item.rate) || 0,
          amount: parseFloat(item.amount) || 0
        }))
      };

      console.log("Sending invoice data to API:", invoiceData); // Debug log

      // Use onSubmit prop if provided (for integration), otherwise make direct API call
      if (onSubmit) {
        await onSubmit(invoiceData);
        return; // Exit early, let parent handle the success flow
      }

      // Direct API call for standalone usage
      const response = await fetch("http://localhost:5000/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      const data = await response.json();
      console.log("API response:", data); // Debug log

      if (response.ok) {
        alert(`✅ Invoice created successfully! Invoice ID: ${data.id}`);
        console.log("Invoice created:", data);
        
        // Reset form after successful submission
        setFormData({
          customerName: "",
          customerEmail: "",
          phone: "",
          a_p_Name: "",
          address: "",
          stRegNo: "",
          ntnNumber: "",
          currency: "PKR",
          salesTax: 17,
          subtotal: 0,
          taxAmount: 0,
          totalAmount: 0,
          billDate: new Date().toISOString().split('T')[0],
          paymentDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          note: "",
        });
        
        // Reset items
        setInvoiceItems([{
          id: 1,
          description: "",
          quantity: "",
          rate: "",
          amount: 0
        }]);
        
        // Reset search term
        setSearchTerm("");
        
      } else {
        console.error("API Error:", data);
        let errorMessage = data.error || data.message || "Failed to create invoice";
        alert(`❌ Error: ${errorMessage}`);
      }
    } catch (err) {
      console.error("Network/Parse Error:", err);
      alert("❌ Something went wrong while saving the invoice. Please check your internet connection and server status.");
    }
  };

  // Calculate subtotal, tax, and total amounts based on all items
  useEffect(() => {
    const subtotal = invoiceItems.reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);

    const taxRate = parseFloat(formData.salesTax) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    setFormData(prev => ({
      ...prev,
      subtotal: subtotal,
      taxAmount: taxAmount,
      totalAmount: totalAmount
    }));
  }, [invoiceItems, formData.salesTax]);

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 sm:p-12 transition-all duration-300">
      {/* Company Header with Logo */}
      <div className="text-center mb-8">
        {companySettings?.logo_path && (
          <div className="mb-4">
            <img 
              src={companySettings.logo_path} 
              alt="Company Logo"
              className="mx-auto h-20 w-auto object-contain"
              onError={(e) => {
                // Fallback to logo from public assets if API logo fails
                e.target.src = '/assets/Logo/Logo.png';
              }}
            />
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {companySettings?.company_name || 'A Rauf Brother Textile'}
        </h1>
        <p className="text-sm text-gray-600">Create New Invoice</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Customer Information */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
            Customer Details
          </h2>
          <div className="grid sm:grid-cols-1 gap-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Customer Name *
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                placeholder={loading ? "Loading customers..." : "Type customer name to search..."}
                required
                disabled={loading}
              />
              
              {/* Dropdown suggestions */}
              {showDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCustomers.map((customer) => (
                    <div
                      key={customer.customer_id}
                      onClick={() => handleCustomerSelect(customer)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {customer.customer.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {customer.customer}
                          </div>
                          {customer.company && (
                            <div className="text-sm text-gray-500 truncate">
                              {customer.company}
                            </div>
                          )}
                          <div className="text-sm text-gray-500 truncate">
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="text-xs text-gray-400">
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* No results message */}
                  {filteredCustomers.length === 0 && searchTerm.length > 0 && (
                    <div className="p-4 text-center text-gray-500">
                      <div className="text-sm">No customers found</div>
                      <div className="text-xs text-gray-400">Try a different search term</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Customer Information Display - Shows when customer is selected */}
          {formData.customerName && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Selected Customer Information</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-600">Name:</span>
                  <span className="ml-2 text-gray-800">{formData.customerName}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-800">{formData.customerEmail}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Phone:</span>
                  <span className="ml-2 text-gray-800">{formData.phone}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-gray-600">Address:</span>
                  <span className="ml-2 text-gray-800">{formData.address}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Invoice Items */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
              Invoice Items
            </h2>
            <button
              type="button"
              onClick={addNewItem}
              className="bg-blue-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Add Item
            </button>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Description *
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Quantity *
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Rate *
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((item, index) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="Item description"
                        required
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        required
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.amount ? item.amount.toFixed(2) : '0.00'}
                        readOnly
                        className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {invoiceItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Totals */}
          <div className="mt-6 border-t pt-4">
            <div className="grid sm:grid-cols-3 gap-6">
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
                label="Sales Tax (%)"
                type="number"
                name="salesTax"
                value={formData.salesTax}
                onChange={handleChange}
                step="0.01"
                min="0"
              />

              <div className="grid gap-3">
                <Input
                  label="Subtotal"
                  type="text"
                  value={formData.subtotal ? formData.subtotal.toFixed(2) : '0.00'}
                  readOnly
                  className="bg-blue-50 border-blue-200 font-medium"
                />

                <Input
                  label="Tax Amount"
                  type="text"
                  value={formData.taxAmount ? formData.taxAmount.toFixed(2) : '0.00'}
                  readOnly
                  className="bg-blue-50 border-blue-200 font-medium"
                />

                <Input
                  label="Total Amount"
                  type="text"
                  value={formData.totalAmount ? formData.totalAmount.toFixed(2) : '0.00'}
                  readOnly
                  className="bg-green-50 border-green-200 font-bold text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Dates and Note */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
            Invoice Info
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <Input
              label="Bill Date"
              type="date"
              name="billDate"
              value={formData.billDate}
              onChange={handleChange}
              required
            />
            <Input
              label="Payment Deadline"
              type="date"
              name="paymentDeadline"
              value={formData.paymentDeadline}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-6">
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
        <div className="text-center mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-10 py-3 rounded-xl shadow-lg transition duration-300"
            onClick={onCancel || (() => window.history.back())}
          >
            {onCancel ? 'Cancel' : 'Back'}
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-3 rounded-xl shadow-lg transition duration-300"
          >
            {initialData ? 'Update Invoice' : 'Send Invoice'}
          </button>
        </div>
      </form>
    </div>
    // </div>
  );
};

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

export default InvoiceForm;
