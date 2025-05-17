import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const InvoiceForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    phone: '',
    address: '',
    stRegNo: '',
    ntnNumber: '',
    phone2: '',
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
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCurrencyChange = (value) => {
    setFormData(prevData => ({
      ...prevData,
      currency: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerEmail) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    console.log('Form submitted:', formData);
    
    toast({
      title: "Invoice Sent",
      description: "Your invoice has been successfully sent.",
    });
  };

  useEffect(() => {
    if (formData.quantity && formData.rate) {
      const quantity = parseFloat(formData.quantity) || 0;
      const rate = parseFloat(formData.rate) || 0;
      const amount = quantity * rate;
      setFormData(prevData => ({
        ...prevData,
        itemAmount: amount.toFixed(2)
      }));
    }
  }, [formData.quantity, formData.rate]);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-medium text-center mb-6 sm:mb-8">Invoice</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Customer Name *</label>
              <Input 
                type="text" 
                name="customerName" 
                placeholder="Type customer name" 
                value={formData.customerName} 
                onChange={handleChange}
                className="bg-gray-50 text-sm sm:text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Customer Email *</label>
              <Input 
                type="email" 
                name="customerEmail" 
                placeholder="Type customer email" 
                value={formData.customerEmail} 
                onChange={handleChange}
                className="bg-gray-50 text-sm sm:text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Telephone Number</label>
              <Input 
                type="tel" 
                name="phone" 
                placeholder="Type Telephone Number" 
                value={formData.phone} 
                onChange={handleChange}
                className="bg-gray-50 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <Input 
                type="text" 
                name="address" 
                placeholder="Type Address" 
                value={formData.address} 
                onChange={handleChange}
                className="bg-gray-50 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">S.T Reg No</label>
              <Input 
                type="text" 
                name="stRegNo" 
                placeholder="Type S.T Reg No" 
                value={formData.stRegNo} 
                onChange={handleChange}
                className="bg-gray-50 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">NTN Number</label>
              <Input 
                type="text" 
                name="ntnNumber" 
                placeholder="Type NTN Number" 
                value={formData.ntnNumber} 
                onChange={handleChange}
                className="bg-gray-50 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Telephone Number 2</label>
              <Input 
                type="tel" 
                name="phone2" 
                placeholder="Type Telephone Number" 
                value={formData.phone2} 
                onChange={handleChange}
                className="bg-gray-50 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <Input 
                type="text" 
                name="itemName" 
                placeholder="Type Item Name" 
                value={formData.itemName} 
                onChange={handleChange}
                className="bg-gray-50 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <Input 
                type="number" 
                name="quantity" 
                placeholder="Type Quantity" 
                value={formData.quantity} 
                onChange={handleChange}
                min="0"
                className="bg-gray-50 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Rate</label>
              <div className="flex">
                <Select value={formData.currency} onValueChange={handleCurrencyChange}>
                  <SelectTrigger className="w-20 bg-gray-50">
                    <SelectValue placeholder="PKR" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PKR">PKR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  type="number" 
                  name="rate" 
                  placeholder="0.00" 
                  value={formData.rate} 
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="ml-2 flex-1 bg-gray-50 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Sales Tax (%)</label>
              <Input 
                type="number" 
                name="salesTax" 
                placeholder="Type Sales Tax" 
                value={formData.salesTax} 
                onChange={handleChange}
                min="0"
                max="100"
                className="bg-gray-50 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Item Amount</label>
              <Input 
                type="number" 
                name="itemAmount" 
                placeholder="Type Item Amount" 
                value={formData.itemAmount} 
                onChange={handleChange}
                className="bg-gray-50 text-sm sm:text-base"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Weight (KG)</label>
              <Input 
                type="number" 
                name="weight" 
                placeholder="Type Weight in KG" 
                value={formData.weight} 
                onChange={handleChange}
                min="0"
                step="0.1"
                className="bg-gray-50 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Total Amount</label>
              <Input 
                type="number" 
                name="totalAmount" 
                placeholder="Type Total Amount" 
                value={formData.totalAmount} 
                onChange={handleChange}
                className="bg-gray-50 text-sm sm:text-base"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Bill Date</label>
              <Input 
                type="date" 
                name="billDate" 
                value={formData.billDate} 
                onChange={handleChange}
                className="bg-gray-50 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Payment Deadline</label>
              <Input 
                type="date" 
                name="paymentDeadline" 
                value={formData.paymentDeadline} 
                onChange={handleChange}
                className="bg-gray-50 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <Textarea 
              name="note" 
              placeholder="This is a custom message that might be relevant to the customer." 
              value={formData.note} 
              onChange={handleChange}
              className="bg-gray-50 min-h-[100px] text-sm sm:text-base"
            />
          </div>

          <div className="flex justify-center mt-6 sm:mt-8">
            <Button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-8 py-2 rounded-md text-sm sm:text-base"
            >
              Send Invoice
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;