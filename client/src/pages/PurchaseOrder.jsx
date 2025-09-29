import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import PurchaseOrderTable from '../components/PurchaseOrderTable';
import PurchaseOrderDetails from '../components/PurchaseOrderDetails';

const PurchaseOrder = () => {
  const { poId } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('list'); // 'list' or 'details'
  const [selectedPOId, setSelectedPOId] = useState(null);
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle URL parameter changes
  useEffect(() => {
    if (poId) {
      setSelectedPOId(poId);
      setActiveView('details');
    } else {
      setActiveView('list');
      setSelectedPOId(null);
    }
    fetchSummaryData();
  }, [poId]);

  const fetchSummaryData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/purchase-orders');
      if (response.ok) {
        const data = await response.json();
        
        // Helper function to format currency values properly
        const formatCurrency = (value) => {
          if (!value || isNaN(value)) return '0';
          return new Intl.NumberFormat('en-PK', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          }).format(value);
        };

        // Calculate statistics from the data
        const totalOrders = data.length;
        const pendingOrders = data.filter(po => po.status === 'Pending').length;
        const totalValue = data.reduce((sum, po) => sum + (parseFloat(po.total_amount) || 0), 0);
        
        // Calculate this month's value
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const thisMonthValue = data.filter(po => {
          const poDate = new Date(po.po_date);
          return poDate.getMonth() === currentMonth && poDate.getFullYear() === currentYear;
        }).reduce((sum, po) => sum + (parseFloat(po.total_amount) || 0), 0);

        setSummaryData([
          {
            title: "Total Purchase Orders",
            amount: totalOrders.toString(),
            currency: "",
            indicator: { text: "+12", color: "blue" },
          },
          {
            title: "Pending Orders",
            amount: pendingOrders.toString(),
            currency: "",
            indicator: { text: "-3", color: "red" },
          },
          {
            title: "Total Value",
            amount: formatCurrency(totalValue),
            currency: "PKR",
            indicator: { text: "+8.5%", color: "green" },
          },
          {
            title: "This Month",
            amount: formatCurrency(thisMonthValue),
            currency: "PKR",
            indicator: { text: "15 New", color: "yellow" },
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching summary data:', error);
      // Set default values on error
      setSummaryData([
        {
          title: "Total Purchase Orders",
          amount: "0",
          currency: "",
          indicator: { text: "+12", color: "blue" },
        },
        {
          title: "Pending Orders",
          amount: "0",
          currency: "",
          indicator: { text: "-3", color: "red" },
        },
        {
          title: "Total Value",
          amount: "0",
          currency: "PKR",
          indicator: { text: "+8.5%", color: "green" },
        },
        {
          title: "This Month",
          amount: "0",
          currency: "PKR",
          indicator: { text: "15 New", color: "yellow" },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };



  const handleViewPODetails = (poId) => {
    // Navigate to the detailed view with PO ID in URL
    navigate(`/purchase-order/${poId}`);
  };

  const handleBackToList = () => {
    // Navigate back to the list view
    navigate('/purchase-order');
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

        {/* Toggle between List and Details View */}
        {activeView === 'list' ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {summaryData.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-1">{item.title}</h3>
                      <div className="flex items-baseline gap-2">
                        {item.currency && (
                          <span className="text-xs text-gray-500">{item.currency}</span>
                        )}
                        <span className="text-2xl font-bold text-gray-900">{item.amount}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3h5v5M4 21l5-5M21 3l-16 16" />
                        <path d="M21 21v-5h-5M4 4h5v5" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.indicator.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      item.indicator.color === 'red' ? 'bg-red-100 text-red-800' :
                      item.indicator.color === 'green' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.indicator.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Purchase Order Table */}
            <PurchaseOrderTable onViewDetails={handleViewPODetails} />
          </>
        ) : (
          <PurchaseOrderDetails 
            poId={selectedPOId} 
            onBack={handleBackToList}
          />
        )}
      </main>
    </div>
  );
};

export default PurchaseOrder;
