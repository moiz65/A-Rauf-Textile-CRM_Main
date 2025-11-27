import React, { useState } from 'react';
import { Package, BarChart3 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CompanyStock from '../components/CompanyStock';
import RegisteredStockPage from '../components/RegisteredStockPage';
import AddStockSidebar from '../components/AddStockSidebar';

const Stock = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const openAddSidebar = (stock = null) => {
    setEditingStock(stock || null);
    setShowAddSidebar(true);
  };

  const handleStockAdded = () => {
    setRefreshKey(k => k + 1);
    setShowAddSidebar(false);
    setEditingStock(null);
  };

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen p-4">
      {/* Sidebar */}
      <div className="hidden md:block fixed h-screen w-64 z-20">
        <Sidebar />
      </div>
      {/* Main Content */}
      <main className="flex-1 p-6 bg-[#F5F5F5] md:ml-64">
        <Header />

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex bg-white rounded-lg p-1 w-fit shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Package className="w-4 h-4" />
              Stock Overview
            </button>
            <button
              onClick={() => setActiveTab('registered')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'registered'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Registered Stock
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
            <CompanyStock onAddStock={() => openAddSidebar(null)} refreshKey={refreshKey} onOpenRegistered={() => setActiveTab('registered')} />
        )}
        {activeTab === 'registered' && (
          <RegisteredStockPage openAddSidebar={openAddSidebar} openEditStock={(s) => openAddSidebar(s)} refreshKey={refreshKey} />
        )}
        
        {/* Footer */}
        <Footer />
      </main>

      {/* Centralized AddStock Sidebar for the Stock page */}
      <AddStockSidebar
        isOpen={showAddSidebar}
        initialData={editingStock}
        onClose={() => { setShowAddSidebar(false); setEditingStock(null); }}
        onSuccess={() => { handleStockAdded(); }}
      />
    </div>
  );
};

export default Stock;
