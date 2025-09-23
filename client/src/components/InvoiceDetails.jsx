import React, { useState, useEffect } from 'react';
import { Printer, Send, Clock, CheckCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/invoices/${id}`);
        if (response.ok) {
        const data = await response.json();
          setInvoiceData(data);
        } else {
          setError('Invoice not found');
        }
      } catch (err) {
        setError('Failed to fetch invoice');
        console.error('Error fetching invoice:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendInvoice = () => {
    // Handle send invoice logic
    console.log('Sending invoice...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoiceData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Invoice not found'}</p>
          <button 
            onClick={() => navigate('/invoices')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-start">
              <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoice #{invoiceData.id}</h1>
              <p className="text-lg text-gray-600 mt-2">Invoice Date: {new Date(invoiceData.bill_date).toLocaleDateString()}</p>
            </div>
                <button 
                  onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
              <Printer className="h-5 w-5" />
                  Print
                </button>
              </div>
            </div>

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-8">
            {/* Sender Information */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">R</span>
                    </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">A Rauf Brother Textile</h2>
                  <p className="text-gray-600">Room No.205 Floor Saleha Chamber, Plot No. 8-9/C-1 Site, Karachi</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><span className="font-semibold">Email:</span> contact@araufbrothe.com</p>
                  <p><span className="font-semibold">S.T. Reg.No:</span> 3253255666541</p>
                </div>
                <div>
                  <p><span className="font-semibold">Telephone No:</span> 021-36404043</p>
                  <p><span className="font-semibold">NTN No:</span> 7755266214-8</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-gray-100 rounded-lg p-3 inline-block">
                  <span className="text-sm text-gray-600">#{new Date().toISOString().split('T')[0]}</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600"><span className="font-semibold">Total Amount</span></p>
                  <p className="text-2xl font-bold text-gray-900">{invoiceData.currency} {invoiceData.total_amount?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Invoice Details Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600"><span className="font-semibold">Bill Date:</span> {new Date(invoiceData.bill_date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600"><span className="font-semibold">Delivery Date:</span> {new Date(invoiceData.bill_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600"><span className="font-semibold">Terms of Payment:</span> Within 15 days</p>
                  <p className="text-sm text-gray-600"><span className="font-semibold">Payment Deadline:</span> {new Date(invoiceData.payment_deadline).toLocaleDateString()}</p>
                </div>
              </div>
              </div>

            {/* Billing Address */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill To:</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">{invoiceData.customer_name}</h4>
                <p className="text-gray-600 mb-2">{invoiceData.address}</p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p><span className="font-semibold">Email:</span> {invoiceData.customer_email}</p>
                    <p><span className="font-semibold">S.T. Reg. No:</span> {invoiceData.st_reg_no}</p>
                  </div>
                  <div>
                    <p><span className="font-semibold">Telephone No:</span> {invoiceData.p_number}</p>
                    <p><span className="font-semibold">NTN No:</span> {invoiceData.ntn_number}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Note Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Note:</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{invoiceData.Note || 'No notes provided'}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Items:</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">NO.</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">DESCRIPTIONS OF GOODS</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">QUANTITY</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">RATE</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">1</td>
                      <td className="border border-gray-300 px-4 py-2">{invoiceData.item_name || 'Product'}</td>
                      <td className="border border-gray-300 px-4 py-2">{invoiceData.quantity?.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2">{invoiceData.currency} {invoiceData.rate}</td>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">{invoiceData.currency} {invoiceData.item_amount?.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              </div>
              
              {/* Totals */}
            <div className="mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600"><span className="font-semibold">Subtotal:</span> {invoiceData.currency} {invoiceData.item_amount?.toLocaleString()}</p>
                    <p className="text-sm text-gray-600"><span className="font-semibold">Tax ({invoiceData.salesTax}%):</span> {invoiceData.currency} {invoiceData.tax_amount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600"><span className="font-semibold">Total:</span> {invoiceData.currency} {invoiceData.total_amount?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="text-sm text-gray-600">
              <p>Please pay within 15 days of receiving this invoice.</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
            {/* Invoice Status */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Invoice not yet sent!</p>
              <button
                onClick={handleSendInvoice}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
              >
                <Send className="h-4 w-4" />
                Send Invoice
              </button>
            </div>

            {/* Payment Status */}
            <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">{invoiceData.status}</span>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
              <p className="text-lg font-semibold text-gray-900 mb-4">Total: {invoiceData.currency} {invoiceData.total_amount?.toLocaleString()} Incl. VAT</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Invoice Amount</p>
                    <p className="text-gray-600">{new Date(invoiceData.bill_date).toLocaleDateString()}</p>
                  </div>
                  <span className="font-semibold text-gray-900">{invoiceData.currency} {invoiceData.total_amount?.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-800">Status: {invoiceData.status || 'Pending'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;