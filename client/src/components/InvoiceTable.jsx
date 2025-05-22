import React, { useState } from 'react';
import { Search, Filter, FileDown, Ellipsis } from 'lucide-react';



// Example invoice data (replace with your own data source)
const invoicesData = [
  {
    id: 'INV-001',
    date: '2024-05-01',
    account: 'Noor Textile',
    amount: 90000,
    status: 'Paid',
  },
  {
    id: 'INV-002',
    date: '2024-05-10',
    account: 'Malik Fabrics',
    amount: 75000,
    status: 'Pending',
  },
  {
    id: 'INV-003',
    date: '2024-05-15',
    account: 'Ahmed Textiles',
    amount: 120000,
    status: 'Overdue',
  },
  {
    id: 'INV-004',
    date: '2024-05-20',
    account: 'Zainab Cloth House',
    amount: 85000,
    status: 'Paid',
  },
];

const STATUS_TABS = ['All', 'Paid', 'Pending', 'Overdue'];
const ITEMS_PER_PAGE = 4;

const InvoiceTable = ({ onCreateInvoice }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // Filtering logic
  const filteredInvoices = invoicesData
    .filter(invoice =>
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.date.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(invoice =>
      activeTab === 'All' || invoice.status === activeTab
    );

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleInvoices = filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const toggleSelectAll = () => {
    if (selectedRows.length === visibleInvoices.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(visibleInvoices.map(invoice => invoice.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedRows([]);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-[30px] shadow-sm border border-gray-100 p-4 sm:p-5">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Invoices</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Effortlessly handle your billing and invoices right here.
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="pl-10 pr-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCreateInvoice}
              className="bg-[#1976D2] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors w-full sm:w-auto text-center"
            >
              Create Invoice
            </button>
            <button className="flex items-center gap-1 bg-white border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-gray-50">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Filter</span>
            </button>
            <button className="flex items-center gap-1 bg-white border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-gray-50">
              <FileDown className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="overflow-x-auto mb-4">
        <div className="flex border-b w-max min-w-full">
          {STATUS_TABS.map(status => (
            <button
              key={status}
              className={`px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === status
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                setActiveTab(status);
                setCurrentPage(1);
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="text-left text-xs sm:text-sm font-normal text-black">
              <th className="pb-3 px-2 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={
                    visibleInvoices.length > 0 &&
                    selectedRows.length === visibleInvoices.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
              </th>
              <th className="pb-3 px-2 whitespace-nowrap">Invoice ID</th>
              <th className="pb-3 px-2 whitespace-nowrap">Billing Date</th>
              <th className="pb-3 px-2 whitespace-nowrap">Account</th>
              <th className="pb-3 px-2 whitespace-nowrap">Amount</th>
              <th className="pb-3 px-2 whitespace-nowrap">Status</th>
              <th className="pb-3 px-2 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleInvoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 text-center text-sm text-gray-500">
                  No invoices found
                </td>
              </tr>
            ) : (
              visibleInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(invoice.id)}
                      onChange={() => toggleSelectRow(invoice.id)}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {invoice.id}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {invoice.date}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {invoice.account}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    RS {invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusClass(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Ellipsis className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredInvoices.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-white">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredInvoices.length)} of {filteredInvoices.length}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 border rounded-md text-sm ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;