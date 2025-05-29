import React, { useState, useEffect } from 'react';

const UNIT_WEIGHT = 10; // 1 unit = 10 kg (adjust as needed)

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
    billDate: '',
    paymentDeadline: '',
    note: ''
  });

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

  useEffect(() => {
    const weight = parseFloat(formData.weight) || 0;
    const rate = parseFloat(formData.rate) || 0;
    const tax = parseFloat(formData.salesTax) || 0;

    const quantity = weight > 0 ? weight / UNIT_WEIGHT : 0;
    const baseAmount = quantity * rate;
    const taxAmount = baseAmount * (tax / 100);
    const total = baseAmount + taxAmount;

    setFormData(prev => ({
      ...prev,
      quantity: quantity.toFixed(2),
      itemAmount: baseAmount.toFixed(2),
      totalAmount: total.toFixed(2)
    }));
  }, [formData.weight, formData.rate, formData.salesTax]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-6 sm:p-10">
        <h1 className="text-3xl font-semibold text-center text-blue-700 mb-10">Invoice Form</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Customer Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Customer Details</h2>
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Item Details</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Input label="Item Name" name="itemName" value={formData.itemName} onChange={handleChange} />
              
              <Input label="Weight (KG)" type="number" name="weight" value={formData.weight} onChange={handleChange} />

              <Input label="Quantity (Auto)" type="number" name="quantity" value={formData.quantity} onChange={handleChange} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                <div className="flex">
                  <select
                    className="bg-gray-50 border border-gray-300 rounded-md p-2 text-sm w-24"
                    value={formData.currency}
                    onChange={handleCurrencyChange}
                  >
                    <option value="PKR">PKR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <input
                    type="number"
                    name="rate"
                    placeholder="0.00"
                    value={formData.rate}
                    onChange={handleChange}
                    className="flex-1 ml-2 p-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                  />
                </div>
              </div>

              <Input label="Sales Tax (%)" type="number" name="salesTax" value={formData.salesTax} onChange={handleChange} />
              <Input label="Item Amount" type="number" name="itemAmount" value={formData.itemAmount} readOnly />
              <Input label="Total Amount" type="number" name="totalAmount" value={formData.totalAmount} readOnly />
            </div>
          </section>

          {/* Dates and Note */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Invoice Info</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Input label="Bill Date" type="date" name="billDate" value={formData.billDate} onChange={handleChange} />
              <Input label="Payment Deadline" type="date" name="paymentDeadline" value={formData.paymentDeadline} onChange={handleChange} />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea
                name="note"
                rows={6}
                value={formData.note}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 bg-gray-50 text-sm"
                placeholder="This is a custom message for the customer."
              ></textarea>
            </div>
          </section>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md transition duration-300"
            >
              Send Invoice
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// ✅ Reusable Input Component
const Input = ({ label, name, type = 'text', value, onChange, required = false, readOnly = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
      className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 text-sm"
    />
  </div>
);

export default InvoiceForm;
