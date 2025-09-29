import React, { useState } from 'react';
import { FileText, BarChart3, DollarSign, ShoppingCart, Users, ChevronRight } from 'lucide-react';

const QuickActions = ({ dashboardData }) => {
  const [activeAction, setActiveAction] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      icon: FileText,
      label: 'Invoices',
      description: `Manage invoices (${dashboardData?.quickActions?.totalInvoices || 0})`,
      color: 'bg-amber-100 text-amber-600',
      hoverColor: 'hover:bg-amber-50',
      action: () => window.location.href = '/Invoices'
    },
    {
      icon: BarChart3,
      label: 'Reports',
      description: 'View business analytics and insights',
      color: 'bg-blue-100 text-blue-600',
      hoverColor: 'hover:bg-blue-50',
      action: () => window.location.href = '/Report'
    },
    {
      icon: DollarSign,
      label: 'Expenses',
      description: `Track expenses (${dashboardData?.quickActions?.totalExpenses || 0})`,
      color: 'bg-emerald-100 text-emerald-600',
      hoverColor: 'hover:bg-emerald-50',
      action: () => window.location.href = '/Expense'
    },
    {
      icon: ShoppingCart,
      label: 'Purchase Orders',
      description: `Manage POs (${dashboardData?.quickActions?.totalPurchaseOrders || 0})`,
      color: 'bg-rose-100 text-rose-600',
      hoverColor: 'hover:bg-rose-50',
      action: () => window.location.href = '/PurchaseOrder'
    },
    {
      icon: Users,
      label: 'Customers',
      description: `Manage customers (${dashboardData?.quickActions?.totalCustomers || 0})`,
      color: 'bg-violet-100 text-violet-600',
      hoverColor: 'hover:bg-violet-50',
      action: () => window.location.href = '/Customers'
    }
  ];

  const visibleActions = isExpanded ? actions : actions.slice(0, 4);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        {actions.length > 4 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            {isExpanded ? 'Show less' : 'Show all'}
            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {visibleActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => {
                setActiveAction(index);
                action.action();
              }}
              onMouseEnter={() => setActiveAction(index)}
              onMouseLeave={() => setActiveAction(null)}
              className={`bg-white rounded-xl p-4 shadow-xs border border-gray-100 transition-all cursor-pointer text-left relative overflow-hidden group ${action.hoverColor}`}
              aria-label={action.label}
            >
              {/* Animated background effect */}
              <div className={`absolute inset-0 ${action.color.replace('bg-', 'bg-opacity-0 group-hover:bg-opacity-5')} transition-opacity`}></div>
              
              <div className="flex flex-col">
                <div className={`inline-flex p-3 rounded-lg ${action.color} w-fit transition-transform group-hover:scale-105 mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{action.label}</h4>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>

              {/* Active indicator */}
              {activeAction === index && (
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${action.color.replace('bg-', 'bg-')} animate-pulse`}></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;