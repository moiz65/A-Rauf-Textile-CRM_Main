import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SummaryCard from '../components/SummaryCard';
import InvoiceTable from '../components/InvoiceTable';
import TransactionHistory from '../components/TransactionHistory';
import { toast } from 'sonner';

const Invoices = () => {
  const summaryData = [
    {
      title: "Today's Revenue",
      amount: "2,837.90",
      currency: "PKR",
      indicator: { text: "+10%", color: "blue" },
    },
    {
      title: "Today's Expenses",
      amount: "25,938.86",
      currency: "PKR",
      indicator: { text: "-5%", color: "red" },
    },
    {
      title: "Overdue Invoices",
      amount: "6,947.00",
      currency: "PKR",
      indicator: { text: "+7", color: "green" },
    },
    {
      title: "Upcoming Payments",
      amount: "6,947.00",
      currency: "PKR",
      indicator: { text: "5 New", color: "yellow" },
    },
  ];

  const invoiceData = [
    { id: '#23456', date: '23 Jan 2023', account: 'Hamza', amount: '1200', status: 'Paid' },
    { id: '#56489-A', date: '23 Feb 2023', account: 'Zain', amount: '7000', status: 'Paid' },
    { id: '#56489-B', date: '23 Mar 2023', account: 'Shaker', amount: '7000', status: 'Paid' },
    { id: '#98380', date: '23 Apr 2023', account: 'Majid', amount: '5698', status: 'Paid' },
    { id: '#90394', date: '23 May 2023', account: 'Sajid', amount: '1200', status: 'Paid' },
    { id: '#929348', date: '23 Jun 2023', account: 'Wajid', amount: '1200', status: 'Paid' },
    { id: '#48394', date: '23 Jul 2023', account: 'Wijid', amount: '1200', status: 'Pending' },
  ];



  const transactions = [
    { id: '1', name: 'Muhammad Hamza', time: '11:23', initial: 'M' },
  ];

  const handleCreateInvoice = () => {
    toast.success('Creating a new invoice...', {
      description: 'Your new invoice is being prepared.',
    });
  };

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen p-4">
      {/* Sidebar */}
      <div className="hidden md:block fixed h-screen w-64 z-20">
        <Sidebar />
      </div>
      {/* Main Content */}
      <main className="flex-1 p-6 bg-[#F5F5F5] md:ml-64">
        <Header name="A RAUF TEXTILE" />

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {summaryData.map((item, index) => (
            <SummaryCard
              key={index}
              title={item.title}
              amount={item.amount}
              currency={item.currency}
              indicator={item.indicator}
            />
          ))}
        </section>

        {/* Invoices - Full Width */}
        <section className="w-full mb-5">
          <InvoiceTable invoices={invoiceData} onCreateInvoice={handleCreateInvoice} />
        </section>

        {/* Transaction History */}
        <section className="mt-5">
          <TransactionHistory transactions={transactions} />
        </section>
      </main>
    </div>
  );
};

export default Invoices;
