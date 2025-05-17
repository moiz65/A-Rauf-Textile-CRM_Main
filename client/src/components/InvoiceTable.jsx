import React from 'react';


const InvoiceTable = ({ invoices, onCreateInvoice }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-[30px] shadow-sm border border-gray-100 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Invoices</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Effortlessly handle your billing and invoices right here.
          </p>
        </div>
        <button 
          onClick={onCreateInvoice} 
          className="bg-[#1976D2] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors w-full sm:w-auto text-center"
        >
          Create Invoice
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-left text-xs sm:text-sm font-normal text-black">
              <th className="pb-3 px-2 whitespace-nowrap">Invoice ID</th>
              <th className="pb-3 px-2 whitespace-nowrap">Billing Date</th>
              <th className="pb-3 px-2 whitespace-nowrap hidden xs:table-cell">Accounts</th>
              <th className="pb-3 px-2 whitespace-nowrap">Amount</th>
              <th className="pb-3 px-2 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="py-3 px-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                  {invoice.id}
                </td>
                <td className="py-3 px-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                  {invoice.date}
                </td>
                <td className="py-3 px-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap hidden xs:table-cell">
                  {invoice.account}
                </td>
                <td className="py-3 px-2 text-xs sm:text-sm font-medium whitespace-nowrap">
                  RS {invoice.amount}
                </td>
                <td className="py-3 px-2 whitespace-nowrap">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] xs:text-xs font-medium ${getStatusClass(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {invoices.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-500">
          No invoices found
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;