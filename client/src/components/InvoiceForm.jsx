import React, { useState, useEffect } from 'react';


const InvoiceForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    phone: '',
    phone2: '',
    address: '',
    stRegNo: '',
    ntnNumber: '',
    itemName: '',
    quantity: '',
    rate: '',
    currency: 'PKR',
    salesTax: '',
    itemAmount: '',
    weight: '',
    totalAmount: '',
    taxAmount: '',
    billDate: '',
    paymentDeadline: '',
    note: ''
  });

  // Only one mode: manual entry for quantity and rate
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCurrencyChange = (e) => {
    setFormData(prev => ({
      ...prev,
      currency: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail) {
      alert("Please fill in required fields.");
      return;
    }
    console.log('Form Data:', formData);
    alert('Invoice sent successfully!');
  };

  // Calculate itemAmount, taxAmount, and totalAmount
  useEffect(() => {
    const quantity = parseFloat(formData.quantity) || 0;
    const rate = parseFloat(formData.rate) || 0;
    const tax = parseFloat(formData.salesTax) || 0;

    const itemAmount = quantity * rate;
    const taxAmount = itemAmount * (tax / 100);
    const totalAmount = itemAmount + taxAmount;

    setFormData(prev => ({
      ...prev,
      itemAmount: itemAmount ? itemAmount.toFixed(2) : '',
      taxAmount: itemAmount ? taxAmount.toFixed(2) : '',
      totalAmount: itemAmount ? totalAmount.toFixed(2) : ''
    }));
  }, [formData.quantity, formData.rate, formData.salesTax]);

  return (
    // <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto bg-white p-8 sm:p-12 transition-all duration-300">
        {/* <h1 className="text-4xl font-bold text-center text-blue-800 mb-12 tracking-tight">Create Invoice</h1> */}

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Customer Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Customer Details</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Input label="Customer Name *" name="customerName" value={formData.customerName} onChange={handleChange} required />
              <Input label="Customer Email *" type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} required />
              <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
              <Input label="Alternate Phone" name="phone2" value={formData.phone2} onChange={handleChange} />
              <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
              <Input label="S.T Reg No" name="stRegNo" value={formData.stRegNo} onChange={handleChange} />
              <Input label="NTN Number" name="ntnNumber" value={formData.ntnNumber} onChange={handleChange} />
            </div>
          </section>

          {/* Item Details */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Item Details</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Input label="Item Name" name="itemName" value={formData.itemName} onChange={handleChange} />

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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Invoice Info</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Input label="Bill Date" type="date" name="billDate" value={formData.billDate} onChange={handleChange} />
              <Input label="Payment Deadline" type="date" name="paymentDeadline" value={formData.paymentDeadline} onChange={handleChange} />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Note</label>
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
              onClick={() => window.history.back()}
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-3 rounded-xl shadow-lg transition duration-300"
            >
              Send Invoice
            </button>
          </div>

        </form>
      </div>
    // </div>
  );
};

// Reusable Input Component
const Input = ({ label, name, type = 'text', value, onChange, required = false, readOnly = false, className = '', ...props }) => (
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
        readOnly ? 'bg-gray-50' : ''
      }`}
      {...props}
    />
  </div>
);

export default InvoiceForm;