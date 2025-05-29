import React, { useState } from 'react';
import { ArrowUpRight, MoreVertical, Lock, TrendingUp, TrendingDown, CreditCard, Banknote, Smartphone, Zap, Check } from 'lucide-react';

const PaymentSummary = () => {
  const [activeMethod, setActiveMethod] = useState(null);
  const [showAllMethods, setShowAllMethods] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const payments = [
    {
      label: 'Upcoming Payments',
      amount: '6,947.00',
      badge: '3 New',
      trend: 'up',
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />
    },
    {
      label: 'Overdue Invoices',
      amount: '6,947.00',
      badge: null,
      trend: 'neutral',
      icon: <Lock className="w-4 h-4 text-amber-500" />
    },
    {
      label: "Today's Revenue",
      amount: '2,837.90',
      badge: '10%',
      trend: 'up',
      icon: <TrendingUp className="w-4 h-4 text-blue-500" />
    },
    {
      label: "Today's Expenses",
      amount: '25,938.86',
      badge: '150%',
      trend: 'down',
      icon: <TrendingDown className="w-4 h-4 text-rose-500" />
    }
  ];

  const paymentMethods = [
    { 
      id: 1,
      icon: <CreditCard className="w-5 h-5" />, 
      label: 'Credit Card',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      id: 2,
      icon: <Banknote className="w-5 h-5" />, 
      label: 'Bank Transfer',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      id: 3,
      icon: <Smartphone className="w-5 h-5" />, 
      label: 'Mobile Wallet',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    { 
      id: 4,
      icon: <Zap className="w-5 h-5" />, 
      label: 'Other Methods',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    }
  ];

  const handleMethodClick = (method) => {
    setActiveMethod(method);
    setShowSuccess(false);
    
    // Demo payment method selection logic
    setTimeout(() => {
      console.log(`Processing payment via ${method.label}`);
      // Simulate API call or payment processing
      setShowSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-all w-full group relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Financial Overview</h3>
          <h2 className="text-2xl font-bold text-gray-900">Payment Summary</h2>
        </div>
        <button className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors text-gray-500 hover:text-gray-700">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Balance Overview */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">Rs9,205,385</span>
              <span className="flex items-center px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                +2.5% <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500">Payment Methods</p>
            {paymentMethods.length > 4 && (
              <button 
                onClick={() => setShowAllMethods(!showAllMethods)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                {showAllMethods ? 'Show less' : 'Show all'}
              </button>
            )}
          </div>
          <div className="flex justify-between">
            {(showAllMethods ? paymentMethods : paymentMethods.slice(0, 4)).map((method) => (
              <button
                key={method.id}
                onClick={() => handleMethodClick(method)}
                className={`flex flex-col items-center transition-all ${activeMethod?.id === method.id ? 'scale-105' : ''}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-xs border border-gray-100 mb-1 transition-colors ${method.bg} ${activeMethod?.id === method.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}>
                  <span className={method.color}>{method.icon}</span>
                  {showSuccess && activeMethod?.id === method.id && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500">{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Demo Payment Status */}
        {showSuccess && activeMethod && (
          <div className="mt-3 p-2 bg-green-50 text-green-700 text-xs rounded-lg animate-pulse">
            Processing payment via {activeMethod.label}...
          </div>
        )}
      </div>

      {/* Payment Details */}
      <div className="space-y-3">
        {payments.map((payment, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50/50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                payment.trend === 'up' ? 'bg-emerald-50' : 
                payment.trend === 'down' ? 'bg-rose-50' : 'bg-amber-50'
              }`}>
                {payment.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">{payment.label}</div>
                {payment.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    payment.trend === 'up' ? 'bg-emerald-100 text-emerald-700' :
                    payment.trend === 'down' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {payment.badge}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">PKR {payment.amount}</div>
              {payment.trend !== 'neutral' && (
                <div className={`text-xs ${
                  payment.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {payment.trend === 'up' ? '↑ Increased' : '↓ Decreased'} from last week
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100/50">
  <a href="/Report" className="block">
    <button className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2 transition-colors">
      View full report
      <ArrowUpRight className="w-4 h-4" />
    </button>
  </a>
</div>
    </div>
  );
};

export default PaymentSummary;