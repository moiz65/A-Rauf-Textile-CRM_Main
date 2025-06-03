import React from 'react';
import { ArrowUpRight, MoreVertical, Lock, TrendingUp, TrendingDown,} from 'lucide-react';

const PaymentSummary = () => {
  // const [showSuccess, setShowSuccess] = useState(false);

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
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-blue-500 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Current Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">Rs9,205,385</span>
              <span className="flex items-center px-2 py-1 rounded-full bg-white text-emerald-700 text-xs font-medium">
                +2.5% <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
          </div>
        </div>
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