import React, { useState, useEffect } from 'react';
import { Plus, Package, TrendingUp } from 'lucide-react';
import { Zap } from 'lucide-react';

const CompanyStock = ({ onAddStock, refreshKey, onOpenRegistered = null }) => {
  const [totalStock, setTotalStock] = useState(0);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [lastRestocked, setLastRestocked] = useState(null);
  // removed topCategories per request to hide categories

  useEffect(() => {
    fetchStockData();
  }, [refreshKey]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/stock');
      if (!response.ok) throw new Error('Failed to fetch stock');
      const data = await response.json();
      
      setStockItems(data);
      const total = data.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
      // value is quantity * price per unit
      const value = data.reduce((sum, item) => sum + ((parseFloat(item.quantity) || 0) * (parseFloat(item.price_per_unit) || 0)), 0);
      // low stock threshold: mark as low if quantity <= 5
      const low = data.filter(i => Number(i.quantity) <= 5).length;
      // last restocked is latest purchase_date (fallback to created_at if available)
      const latest = data.reduce((acc, item) => {
        const date = item.purchase_date || item.created_at || null;
        if (!date) return acc;
        return !acc || new Date(date) > new Date(acc) ? date : acc;
      }, null);

      setTotalStock(total);
      setTotalValue(value);
      setLowStockCount(low);
      setLastRestocked(latest);
      // categories hidden by user preference — no topCategories computed
    } catch (err) {
      console.error('Error fetching stock:', err);
      setStockItems([]);
      setTotalStock(0);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStockSuccess = () => {
    fetchStockData();
  };

  const formatCurrency = (amt) => `PKR ${Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Company Stock</h2>
            <p className="text-sm text-gray-500">Current inventory status</p>
          </div>
        </div>
        <button
          onClick={onAddStock}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Stock
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Stock */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Stock Items</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{totalStock}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-400 opacity-50" />
          </div>
        </div>

        {/* Total Stock Value */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-600 font-medium">Total Stock Value</p>
              <p className="text-3xl font-bold text-indigo-900 mt-2">{formatCurrency(totalValue)}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-indigo-400 opacity-50" />
          </div>
        </div>

        {/* (Categories card removed per user request) */}

        {/* Low Stock */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Low Stock</p>
              <p className="text-3xl font-bold text-yellow-900 mt-2">{lowStockCount}</p>
            </div>
            <Zap className="w-10 h-10 text-yellow-400 opacity-50" />
          </div>
        </div>

        {/* Last Updated */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Last Updated</p>
              <p className="text-lg font-bold text-purple-900 mt-2">
                {lastRestocked ? new Date(lastRestocked).toLocaleDateString() : new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-400 opacity-20 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Recent Stock Items Preview */}
      {stockItems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Items</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {stockItems.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.item_name}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.status === 'Active' ? 'bg-green-100 text-green-700' :
                      item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                      item.status === 'Discontinued' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{item.status || 'Unknown'}</span>
                    <span className="text-xs text-gray-500">{Number(item.quantity || 0).toFixed(2)} {item.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-600">{Number(item.quantity || 0).toFixed(2)} {item.unit}</div>
                  <div className="text-xs text-gray-500">{formatCurrency(Number(item.quantity || 0) * Number(item.price_per_unit || 0))}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Low Stock Items */}
      {stockItems.length > 0 && lowStockCount > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Low Stock Items</h3>
          <div className="bg-red-50 rounded-lg p-3">
            {stockItems.filter(i => Number(i.quantity) <= 5).slice(0, 5).map(i => (
              <div key={i.id} className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{i.item_name}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      i.status === 'Active' ? 'bg-green-100 text-green-700' :
                      i.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                      i.status === 'Discontinued' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{i.status || 'Unknown'}</span>
                    <span className="text-xs text-gray-500">{Number(i.quantity || 0).toFixed(2)} {i.unit}</span>
                  </div>
                </div>
                <div className="text-sm text-red-700 font-semibold">{formatCurrency(Number(i.quantity || 0) * Number(i.price_per_unit || 0))}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top categories removed per user request */}

      {/* Action Buttons */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
        <button
          onClick={() => onAddStock && onAddStock()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Stock
        </button>
        <button
          onClick={() => onOpenRegistered && onOpenRegistered()}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          Registered Stock
        </button>
      </div>
    </div>
  );
};

export default CompanyStock;
