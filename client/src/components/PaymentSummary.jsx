import React from 'react';
import { ArrowUpRight, MoreVertical, ChevronDown, Lock, TrendingUp, TrendingDown } from 'lucide-react';

const PaymentSummary = () => {
  const payments = [
    {
      label: 'Upcoming Payments',
      amount: '6,947.00',
      badge: '3 New',
      badgeColor: 'bg-orange-100 text-orange-700',
      icon: <TrendingUp className="w-4 h-4 text-orange-600" />,
      trend: 'up'
    },
    {
      label: 'Overdue Invoices',
      amount: '6,947.00',
      badge: null,
      badgeColor: '',
      icon: <Lock className="w-4 h-4 text-gray-500" />,
      trend: 'neutral'
    },
    {
      label: "Today's revenue",
      amount: '2,837.90',
      badge: '10%',
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: <TrendingUp className="w-4 h-4 text-blue-600" />,
      trend: 'up'
    },
    {
      label: "Today's expenses",
      amount: '25,938.86',
      badge: '150%',
      badgeColor: 'bg-red-100 text-red-700',
      icon: <TrendingDown className="w-4 h-4 text-red-600" />,
      trend: 'down'
    }
  ];

  const paymentMethods = [
    { color: 'bg-yellow-100', icon: '💳', label: 'Cards' },
    { color: 'bg-blue-100', icon: '🏦', label: 'Bank' },
    { color: 'bg-green-100', icon: '📱', label: 'Mobile' },
    { color: 'bg-red-100', icon: '🔒', label: 'Other' }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 hover:shadow-sm transition-all w-full group">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Financial Overview</h3>
          <h2 className="text-2xl font-bold text-gray-900">Payment Summary</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Total Balance */}
      <div className="mb-8 text-center">
        <div className="relative inline-block">
          <div className="text-4xl font-bold text-gray-900 mb-3">Rs9,385</div>
          <div className={`absolute -top-2 -right-6 flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            true ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {true ? '+' : ''}2.5%
            <ArrowUpRight className={`w-3 h-3 ml-1 ${
              true ? 'text-green-600 rotate-0' : 'text-red-600 rotate-180'
            }`} />
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="flex justify-center gap-3 mb-2">
          {paymentMethods.map((method, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-10 h-10 ${method.color} rounded-xl flex items-center justify-center mb-1`}>
                <span className="text-lg">{method.icon}</span>
              </div>
              <span className="text-xs text-gray-500">{method.label}</span>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
          <ChevronDown className="w-3 h-3" />
          <span>View payment channels</span>
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-4">
        {payments.map((payment, index) => (
          <div key={index} className="flex items-center justify-between group-hover:opacity-90 hover:opacity-100 hover:bg-gray-50 p-2 rounded-lg transition-all">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${payment.trend === 'up' ? 'bg-green-50' : payment.trend === 'down' ? 'bg-red-50' : 'bg-gray-50'}`}>
                {payment.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">{payment.label}</div>
                {payment.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${payment.badgeColor} mt-1 inline-block`}>
                    {payment.badge}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">PKR {payment.amount}</div>
              {payment.trend !== 'neutral' && (
                <div className={`text-xs ${
                  payment.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {payment.trend === 'up' ? '↑ Increase' : '↓ Decrease'} from last week
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-center gap-2 transition-colors">
          <span>View full report</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PaymentSummary;