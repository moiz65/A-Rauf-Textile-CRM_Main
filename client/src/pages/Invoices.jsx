import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import SummaryCard from '../components/SummaryCard';
import InvoiceTable from '../components/InvoiceTable';
import RecentActivity from '../components/RecentActivity';
import TransactionHistory from '../components/TransactionHistory';
import { toast } from 'sonner';

const Invoices = () => {
  const summaryData = [
    {
      title: "Today's revenue",
      amount: "2,837.90",
      currency: "PKR",
      indicator: { text: "+10%", color: "blue" },
    },
    {
      title: "Today's expenses",
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

  const recentActivities = [
    {
      id: '1',
      name: 'Zain',
      value: '7,242',
      percentage: '+7.34%',
      trend: 'up',
      initial: 'Z',
      color: 'bg-blue-500',
    },
    {
      id: '2',
      name: 'Samsen',
      value: '4,384',
      percentage: '-3.85%',
      trend: 'down',
      initial: 'S',
      color: 'bg-teal-500',
    },
    {
      id: '3',
      name: 'Nikom',
      value: '539',
      percentage: '-1.48%',
      trend: 'down',
      initial: 'N',
      color: 'bg-green-500',
    },
    {
      id: '4',
      name: 'Pasion',
      value: '539',
      percentage: '-2.48%',
      trend: 'down',
      initial: 'P',
      color: 'bg-red-500',
    },
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
    <div className="flex bg-[#F5F5F5] min-h-screen p-3">
      <Sidebar />
      <main className="flex-1 p-6 bg-[#F5F5F5]">
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

        {/* Invoices and Recent Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-3 mb-5">
            <InvoiceTable invoices={invoiceData} onCreateInvoice={handleCreateInvoice} />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity customers={recentActivities} />
          </div>
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
