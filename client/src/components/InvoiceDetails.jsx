import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  Printer, 
  Send, 
  Bell, 
  Settings,
  ArrowLeft,
  Download,
  Mail,
  Share,
  Edit
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://localhost:5000/api';

const InvoiceTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/invoices/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch invoice');
        }
        const data = await response.json();
        setInvoice(data);
        
        // Transform the invoice data into the format expected by the component
        if (data) {
          // Create invoice items from the single item in the invoice
          const items = [{
            no: 1,
            description: data.item_name || "Product Name",
            quantity: data.quantity?.toString() || "0",
            netWeight: "894", // This would need to come from your actual data
            rate: data.rate?.toString() || "0",
            vat: data.tax_amount?.toString() || "0",
            dateOfSales: new Date(data.bill_date).toLocaleDateString() || "",
            additionalSales: "0", // This would need to come from your actual data
            finalAmount: data.total_amount?.toString() || "0"
          }];
          
          setInvoiceItems(items);
          
          // Create mock payment history based on invoice status
          const payments = data.status === "Paid" ? [
            {
              id: data.id,
              type: "Full Payment",
              date: new Date().toLocaleDateString(),
              amount: data.total_amount,
              status: "paid"
            }
          ] : data.status === "Partial" ? [
            {
              id: `${data.id}-partial`,
              type: "Partial Payment",
              date: new Date().toLocaleDateString(),
              amount: data.total_amount / 2,
              status: "paid"
            }
          ] : [];
          
          setPaymentHistory(payments);
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
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

  const handleDownload = () => {
    // Implement download functionality
    alert("Download functionality would be implemented here");
  };

  const handleSendEmail = () => {
    // Implement email sending functionality
    alert("Email sending functionality would be implemented here");
  };

  const handleShare = () => {
    // Implement share functionality
    alert("Share functionality would be implemented here");
  };

  const handleEdit = () => {
    navigate(`/invoices/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Invoice not found</h2>
          <p className="mt-2 text-gray-600">The requested invoice could not be loaded.</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 text-gray-500 hover:text-gray-700 mr-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Welcome Back!</div>
                <div className="font-semibold text-gray-900">A RAUF TEXTILE</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Invoice Detail */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Action Buttons */}
            <div className="flex justify-between items-center print:hidden">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Invoice #{invoice.id}</h1>
                <p className="text-sm text-gray-600">Invoice Date: {new Date(invoice.bill_date).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handleEdit}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button 
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </button>
                <button 
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>

            {/* Company Info and Invoice Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg">
                <div className="p-6">
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900">A Rauf Brother Textile</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Room No.205 Floor Saleha Chamber, Plot No. B-9/C-1 Site, Karachi</p>
                      <p>contact@araufbrothertextile.com</p>
                      <p>S. T. Reg No: 3253255606541</p>
                      <p>Telephone No: 021-36404043</p>
                      <p>NTN No: 7755266214-8</p>
                    </div>
                  </div>
                  <div className="mt-6 text-right">
                    <p className="text-sm text-gray-600">#{invoice.id}</p>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">{invoice.currency} {invoice.total_amount?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Status and Actions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    invoice.status === "Paid" 
                      ? "bg-green-100 text-green-800" 
                      : invoice.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {invoice.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={handleSendEmail}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </button>
                  <button 
                    onClick={handleShare}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-blue-600 text-white rounded-lg">
                <div className="p-6">
                  <h4 className="font-semibold mb-4">Billing Information</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">Bill Date</p>
                      <p>{new Date(invoice.bill_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Delivery Date</p>
                      <p>{new Date(invoice.bill_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Terms of Payment</p>
                      <p>Within 15 days</p>
                    </div>
                    <div>
                      <p className="font-medium">Payment Deadline</p>
                      <p>{new Date(invoice.payment_deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg">
                <div className="p-6">
                  <h4 className="font-semibold mb-4 text-gray-900">Billing Address</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.customer_name}</p>
                      <p>{invoice.address}</p>
                      <p>{invoice.customer_email}</p>
                    </div>
                    <div>
                      <p>S. T. Reg No: {invoice.st_reg_no}</p>
                      <p>Telephone No: {invoice.p_number}</p>
                      <p>NTN No: {invoice.ntn_number}</p>
                    </div>
                    <div className="mt-4">
                      <p className="font-medium text-gray-900">Note</p>
                      <p>{invoice.Note || "This is a custom message that might be relevant to the customer. It can span up to three or four rows."}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr className="border-b border-gray-200">
                      <th className="p-3 text-left text-sm font-medium text-gray-600">NO.</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">DESCRIPTION OF GOODS</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">QUANTITY</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">NET WEIGHT IN KG</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">RATE</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">VAT</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">DATE OF SALES TAX</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">AMOUNT OF ADDITIONAL SALES TAX</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-600">FINAL AMOUNT INCLUDING SALES TAX</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-900">{item.no}</td>
                        <td className="p-3 text-sm text-gray-900">{item.description}</td>
                        <td className="p-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="p-3 text-sm text-gray-900">{item.netWeight}</td>
                        <td className="p-3 text-sm text-gray-900">{item.rate}</td>
                        <td className="p-3 text-sm text-gray-900">{item.vat}</td>
                        <td className="p-3 text-sm text-gray-900">{item.dateOfSales}</td>
                        <td className="p-3 text-sm text-gray-900">{item.additionalSales}</td>
                        <td className="p-3 text-sm text-gray-900">{item.finalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Totals */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="space-y-2 max-w-md ml-auto">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total HT</span>
                    <span className="text-gray-900">{invoice.currency} {invoice.item_amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rate</span>
                    <span className="text-gray-900">{invoice.rate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total VAT</span>
                    <span className="text-gray-900">{invoice.currency} {invoice.tax_amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span className="text-gray-900">Total Price</span>
                    <span className="text-gray-900">{invoice.currency} {invoice.total_amount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="border border-gray-200 rounded-lg">
              <div className="p-6">
                <h4 className="font-semibold mb-2 text-gray-900">Terms & Conditions</h4>
                <p className="text-sm text-gray-600">
                  {invoice.Note || "Please pay within 15 days of receiving this invoice."}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-500 print:mt-10">
              <p>A Rauf Brother Textile - Thank you for your business!</p>
              <p className="mt-2">Room No.205 Floor Saleha Chamber, Plot No. B-9/C-1 Site, Karachi | Phone: 021-36404043</p>
            </div>
          </div>

          {/* Payment Summary Panel */}
          <div className="w-80 bg-white border-l border-gray-300 p-6 overflow-y-auto print:hidden">
            {/* Paid Status */}
            <div className="mb-6">
              <div className={`px-4 py-2 rounded-lg text-center font-medium ${
                invoice.status === "Paid" 
                  ? "bg-green-100 text-green-700" 
                  : invoice.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {invoice.status === "Paid" && <CheckCircle className="h-4 w-4 inline mr-2" />}
                {invoice.status}
              </div>
            </div>

            {/* Summary */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total</span>
                <span className="font-bold text-gray-900">{invoice.currency} {invoice.total_amount?.toLocaleString()} Incl. VAT</span>
              </div>
            </div>

            {/* Payment History */}
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{payment.type}</p>
                        <p className="text-xs text-gray-600 mt-1">No. {payment.id}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date</span>
                      <span className="text-gray-900">{payment.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount</span>
                      <span className="text-gray-900 font-medium">{invoice.currency} {payment.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {paymentHistory.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-4">
                  No payment history available
                </div>
              )}
            </div>

            {/* Remaining Amount */}
            {invoice.status !== "Paid" && (
              <div className="border border-gray-200 rounded-lg p-4 mt-6 bg-gray-100 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Remaining Amount</span>
                  <span className="font-bold text-gray-900">{invoice.currency} {invoice.total_amount?.toLocaleString()} Incl. VAT</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;