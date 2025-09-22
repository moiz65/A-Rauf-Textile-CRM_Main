import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Logo from '../assets/Logo/Logo.png';


const API_BASE_URL = 'http://localhost:5000/api';

const InvoiceTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error loading invoice</div>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/invoices')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Invoice not found</div>
          <button
            onClick={() => navigate('/invoices')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
  <div className="flex h-screen bg-background" style={{ backgroundColor: "#F4F5F6" }}>
    {/* Sidebar */}
    <div className="hidden md:block fixed h-full w-64 z-20">
      <Sidebar />
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col md:ml-64 relative">
      {/* Header */}
      <Header name="A RAUF TEXTILE" />

      {/* Main Container */}
      <div className="flex-1 p-6">
        {/* Invoice Header */}
<div className="flex justify-between items-start mb-6">
  <div>
    <h1 className="text-[24px] font-semibold text-[#333]">Invoice #1309</h1>
    <p className="text-[15px] text-[#667085] mt-1">Invoice Date : 3-FEB-2025</p>    
  </div>
<div className="flex justify-center mt-4">
      <button className="flex flex-row justify-center items-center p-5 gap-[10px] w-[193px] h-[47px] bg-[#1976D2] rounded-xl">
        <span className="font-poppins font-semibold text-[18px] leading-[27px] text-white">
          Print
        </span>
      </button>
    </div>

          

        </div>
        <div className="flex gap-6">
          
          {/* Left Content - Invoice */}
          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Invoice Header */}
            <div className="flex flex-row justify-center items-center gap-6 p-0" 
              style={{ width: '1172px', height: '63px', flex: 'none', order: 0, alignSelf: 'stretch', flexGrow: 0 }}>              
            </div>

            <div className="relative flex justify-center items-center gap-6 px-8 py-8" style={{ width: '737px', height: '130px' }}>
              {/* Company Info - Left Section */}
              <div className="flex items-center gap-5" style={{ width: '538px', height: '130px', flex: '1 1 0%' }}>
                {/* Logo */}
                <div style={{ width: '130px', height: '130px', flexShrink: 0 }}>
                  <img src={Logo} alt="Company Logo" className="w-full h-full object-contain" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-1.5" style={{ width: '388px', height: '130px', flex: '1 1 0%' }}>
                  {/* Company Name */}
                  <h2 className="text-[14px] font-semibold leading-[140%] tracking-[0.005em] text-[#333843] w-full">
                    A Rauf Brother Textile
                  </h2>

                  {/* Company Details */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <p className="text-[12px] leading-[132%] tracking-[0.005em] text-[#667085]">
                      Room No.205 Floor Saleha Chamber, Plot No. 8-9/C-1 Site, Karachi
                    </p>
                    <p className="text-[12px] leading-[132%] tracking-[0.005em] text-[#667085]">
                      contact@araufbrothe.com
                    </p>
                    <p className="text-[12px] leading-[132%] tracking-[0.005em] text-[#667085] font-semibold">
                      S.T. Reg.No: 3253255666541
                    </p>
                    <p className="text-[12px] leading-[132%] tracking-[0.005em] text-[#667085]">
                      Telephone No: 021-36404043
                    </p>
                    <p className="text-[12px] leading-[132%] tracking-[0.005em] text-[#667085] font-semibold">
                      NTN No: 7755266214-8
                    </p>
                  </div>
                </div>
              </div>

              {/* Invoice Number and Total Amount - Right Section */}
              <div className="flex flex-col justify-between items-end gap-2" style={{ width: '175px', height: '130px', flexShrink: 0 }}>
                {/* Invoice Number */}
                <div className="flex justify-center items-center px-3 py-2 bg-[#F4F5F6] rounded-lg">
                  <span className="text-[12px] font-semibold leading-[132%] tracking-[0.005em] text-[#333843]">
                    #2025-02-03
                  </span>
                </div>

                {/* Total Amount */}
                <div className="flex flex-col items-end gap-2" style={{ width: '175px' }}>
                  <span className="text-[12px] font-medium leading-[132%] tracking-[0.005em] text-[#667085] w-full text-right">
                    Total Amount
                  </span>
                  <span className="text-[20px] font-bold leading-[24px] tracking-[0.005em] text-[#333843] w-full text-right">
                    PKR 1,075,625.46
                  </span>
                </div>
              </div>

              {/* Action Box */}
              <div className="absolute flex flex-col items-center p-6 gap-4 isolate bg-white border border-[#F0F1F3] shadow-[0px_4px_30px_rgba(26,28,33,0.05)] rounded-xl"
                style={{ width: '344px', height: '130px', left: '867px', top: '-46px' }}>
                {/* Status Text */}
                <h3 className="w-[296px] h-[22px] font-inter font-semibold text-[16px] leading-[140%] tracking-[0.005em] text-[#333843] text-center flex-none order-0 self-stretch flex-grow-0 z-[1]">
                  Invoice not yet sent!
                </h3>

                {/* Send Invoice Button */}
                <button className="flex flex-row justify-center items-center py-3 px-4 gap-2 w-[296px] h-[44px] bg-[#1976D2] rounded-lg flex-none order-1 self-stretch flex-grow-0 z-0">
                  {/* Send Icon */}
                  <svg className="w-5 h-5 flex-none order-0 flex-grow-0" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                    style={{ position: 'relative', left: '', right: '', top: '-2.73%', bottom: '12.43%' }}>
                    <path d="M18.3334 9.99935L1.66675 9.99935M18.3334 9.99935L11.6667 16.666M18.3334 9.99935L11.6667 3.33268"
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {/* Button Text */}
                  <span className="w-[88px] h-5 font-inter font-semibold text-[14px] leading-[140%] tracking-[0.005em] text-white flex-none order-1 flex-grow-0">
                    Send Invoice
                  </span>
                </button>
              </div>
            </div>

            {/* Billing Information Section */}
            <div className="p-6 border rounded-lg border-gray-200">
              <div className="grid grid-cols-5 gap-6">
                <div className="col-span-1 bg-[#1976D2] rounded-lg text-white p-4">
                  <p className="text-[14px] mb-1">Bill Date</p>
                  <p className="text-[16px] font-medium">03/05/2020</p>
                  
                  <p className="text-[14px] mb-1 mt-4">Delivery Date</p>
                  <p className="text-[16px] font-medium">03/05/2020</p>
                  
                  <p className="text-[14px] mb-1 mt-4">Terms of Payment</p>
                  <p className="text-[16px] font-medium">Within 15 days</p>
                  
                  <p className="text-[14px] mb-1 mt-4">Payment Deadline</p>
                  <p className="text-[16px] font-medium">05/18/2020</p>
                </div>

                <div className="col-span-3">
                  <p className="text-[15px] font-medium text-[#333] mb-2">Billing Address</p>
                  <h3 className="text-[16px] font-semibold text-[#333] mb-1">M/s. TF APPARELS</h3>
                  <p className="text-[14px] text-[#666]">plot nO. a-29/j.site, karachi</p>
                  <p className="text-[14px] text-[#666]">om@om.com</p>
                  <p className="text-[14px] text-[#666]">S.T. Reg.No: 562466657445</p>
                  <p className="text-[14px] text-[#666]">Telephone No: 021-36947339</p>
                  <p className="text-[14px] text-[#666]">NTN No: 7755266214-8</p>
                  
                  <div className="mt-4">
                    <p className="text-[15px] font-medium text-[#333] mb-2">Note</p>
                    <p className="text-[14px] text-[#666] leading-relaxed">
                      This is a custom message that might be relevant to the customer. It can span up to three or four rows. It can span up to three or four rows.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Table */}
            <div className="px-6 py-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500">NO.</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500">DESCRIPTION OF GOODS</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">QUANTITY</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">NET WEIGHT IN KG</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">RATE</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">AMOUNT OF SALES TAX</th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500">FINAL AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 px-4 text-sm text-gray-600">{index}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">Product Name</td>
                      <td className="py-4 px-4 text-sm text-gray-600 text-right">6,246</td>
                      <td className="py-4 px-4 text-sm text-gray-600 text-right">894</td>
                      <td className="py-4 px-4 text-sm text-gray-600 text-right">147</td>
                      <td className="py-4 px-4 text-sm text-gray-600 text-right">911,547.00</td>
                      <td className="py-4 px-4 text-sm text-gray-900 text-right">1,075,625.46</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <div className="w-64 text-right space-y-2">
                <div>
                  <div className="text-sm text-gray-600">Total HT</div>
                  <div className="text-base font-medium">5,000,523.46</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Rate</div>
                  <div className="text-base">147</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total VAT</div>
                  <div className="text-base">0</div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-sm font-medium text-gray-600">Total Price</div>
                  <div className="text-lg font-bold">1,075,625.46</div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="p-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-600 mb-1">Terms & Conditions</h4>
              <p className="text-sm text-gray-600">Please pay within 15 days of receiving this invoice.</p>
            </div>
          </div>

            {/* Summary Box */}
            <div className="bg-white border border-[#F0F1F3] rounded-xl shadow-[0px_4px_30px_rgba(26,28,33,0.05)] mt-4">
              <div className="p-4 border-b border-[#E0E2E7]">
                <h3 className="text-[16px] font-semibold leading-[140%] tracking-[0.005em] text-[#333843]">Summary</h3>
              </div>

              <div className="flex justify-between items-center p-4 bg-[#FAFAFA]">
                <span className="text-[14px] font-semibold leading-[140%] tracking-[0.005em] text-[#333843]">Total</span>
                <span className="text-[14px] font-semibold leading-[140%] tracking-[0.005em] text-[#333843]">3,030 Incl. VAT</span>
              </div>

              {/* Payment History */}
              <div className="p-6">
                <div className="space-y-6">
                  {/* Deposit Payment */}
                  <div className="flex gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-[#1EB386]" />
                      <div className="absolute top-3 left-1.5 w-[1px] h-[84px] border-r border-dashed border-[#E0E2E7]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold leading-[140%] tracking-[0.005em] text-[#333843] mb-2">
                        Deposit No. 2020-04-0006
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[14px] text-[#667085]">Date</span>
                          <span className="text-[14px] font-medium text-[#333843]">Oct 24, 2019</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[14px] text-[#667085]">Amount</span>
                          <span className="text-[14px] font-medium text-[#333843]">300</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Partial Payments */}
                  {[{ date: 'Oct 26, 2019', amount: '400' }, { date: 'Oct 27, 2019', amount: '2,230' }].map(
                    (payment, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="relative">
                          <div className="w-3 h-3 rounded-full bg-[#1EB386]" />
                          {index === 0 && (
                            <div className="absolute top-3 left-1.5 w-[1px] h-[84px] border-r border-dashed border-[#E0E2E7]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[14px] font-semibold leading-[140%] tracking-[0.005em] text-[#333843] mb-2">
                            Partial Payment
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[14px] text-[#667085]">Date</span>
                              <span className="text-[14px] font-medium text-[#333843]">{payment.date}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[14px] text-[#667085]">Amount</span>
                              <span className="text-[14px] font-medium text-[#333843]">{payment.amount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <hr className="my-6 border-t border-[#F0F1F3]" />

                {/* Remaining Amount */}
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-semibold text-[#333843]">Remaining Amount</span>
                  <div className="px-3 py-1 bg-[#FEF0F0] rounded-lg">
                    <span className="text-[14px] font-semibold text-[#333843]">100 Incl. VAT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

);

};

export default InvoiceTemplate;
