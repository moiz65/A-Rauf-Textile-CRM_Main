import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SummaryCard from '../components/SummaryCard';
import InvoiceTable from '../components/InvoiceTable';
import TransactionHistory from '../components/TransactionHistory';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:5000/api';

const Invoices = () => {
  const [summaryData, setSummaryData] = useState([
    {
      title: "Total Invoices",
      amount: "0",
      currency: "",
      indicator: { text: "Loading...", color: "gray" },
    },
    {
      title: "Awaiting Payment",
      amount: "0",
      currency: "PKR", 
      indicator: { text: "Loading...", color: "gray" },
    },
    {
      title: "Overdue Amount",
      amount: "0",
      currency: "PKR",
      indicator: { text: "Loading...", color: "gray" },
    },
    {
      title: "Paid Invoices",
      amount: "0",
      currency: "PKR",
      indicator: { text: "Loading...", color: "gray" },
    },
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch real invoice statistics
  const fetchInvoiceStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all invoices data (both regular and PO invoices)
      const [regularResponse, poResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/invoices?exclude_po=true&limit=1000`),
        fetch(`${API_BASE_URL}/invoices?invoice_type=po_invoice&limit=1000`)
      ]);
      
      const [regularData, poData] = await Promise.all([
        regularResponse.ok ? regularResponse.json() : { data: [] },
        poResponse.ok ? poResponse.json() : { data: [] }
      ]);
      
      const regularInvoices = regularData.data || [];
      const poInvoices = poData.data || [];
      const allInvoices = [...regularInvoices, ...poInvoices];
      
      // Helper function to format currency
      const formatCurrency = (value) => {
        if (!value || isNaN(value)) return '0';
        return new Intl.NumberFormat('en-PK', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(value);
      };
      
      // Calculate statistics
      // All paid invoices (only Paid status)
      const paidInvoices = allInvoices.filter(inv => inv.status === 'Paid');
      const paidAmount = paidInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
      
      // Outstanding invoices (Not Sent, Draft, Sent, Pending - awaiting payment, excludes Paid and Overdue)
      const outstandingInvoices = allInvoices.filter(inv => 
        inv.status === 'Not Sent' || inv.status === 'Draft' || inv.status === 'Sent' || inv.status === 'Pending'
      );
      const outstandingAmount = outstandingInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
      
      // Overdue invoices (need immediate attention - separate category)
      const overdueInvoices = allInvoices.filter(inv => inv.status === 'Overdue');
      const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
      
      setSummaryData([
        {
          title: "Total Invoices",
          amount: allInvoices.length.toString(),
          currency: "",
          indicator: { 
            text: `${regularInvoices.length} Regular + ${poInvoices.length} PO`,
            color: allInvoices.length > 0 ? "blue" : "gray" 
          },
        },
        {
          title: "Pending Invoice Payment", 
          amount: formatCurrency(outstandingAmount),
          currency: "PKR",
          indicator: { 
            text: `${outstandingInvoices.length} Invoices`,
            color: outstandingInvoices.length > 0 ? "yellow" : "green" 
          },
        },
        {
          title: "Overdue Invoice Amount",
          amount: formatCurrency(overdueAmount),
          currency: "PKR",
          indicator: { 
            text: overdueInvoices.length > 0 ? `${overdueInvoices.length} Need Action` : "All Clear",
            color: overdueInvoices.length > 0 ? "red" : "green" 
          },
        },
        {
          title: "Paid Invoice Invoices",
          amount: formatCurrency(paidAmount),
          currency: "PKR",
          indicator: { 
            text: `${paidInvoices.length} Completed`,
            color: paidInvoices.length > 0 ? "green" : "gray" 
          },
        },
      ]);
      
    } catch (error) {
      console.error('Error fetching invoice statistics:', error);
      toast.error('Failed to load invoice statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceStats();
  }, []);

  // InvoiceTable and TransactionHistory components now fetch their own data

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
        <div className="flex justify-between items-center mb-6">
        
        </div>
  <Header />
        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {summaryData.map((item, index) => (
            <SummaryCard
              key={index}
              title={item.title}
              amount={loading ? "..." : item.amount}
              currency={item.currency}
              indicator={item.indicator}
            />
          ))}
        </section>

        {/* Invoices - Full Width */}
        <section className="w-full mb-5">
          <InvoiceTable onCreateInvoice={handleCreateInvoice} />
        </section>

        {/* Transaction History */}
        <section className="mt-5">
          <TransactionHistory />
        </section>

      {/* Footer */}
      <Footer />
      </main>
      

    </div>
  );
};

export default Invoices;
