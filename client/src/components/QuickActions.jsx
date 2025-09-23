import React, { useState } from 'react';
import { Package, BarChart3, CreditCard, Clock, Plus, ChevronRight } from 'lucide-react';

const QuickActions = () => {
  const [activeAction, setActiveAction] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      icon: Package,
      label: 'Inventory',
      description: 'Manage product stock and supplies',
      color: 'bg-amber-100 text-amber-600',
      hoverColor: 'hover:bg-amber-50',
      action: () => console.log('Inventory clicked')
    },
    {
  icon: BarChart3,
  label: 'Reports',
  description: 'View business analytics and insights',
  color: 'bg-blue-100 text-blue-600',
  hoverColor: 'hover:bg-blue-50',
  action: () => {
    console.log('Reports clicked');
    window.location.href = '/Report'; // or use navigation if using React Router
  }
  },
    {
      icon: CreditCard,
      label: 'Accounts',
      description: 'Access financial accounts',
      color: 'bg-emerald-100 text-emerald-600',
      hoverColor: 'hover:bg-emerald-50',
      action: () => console.log('Accounts clicked')
    },
    {
      icon: Clock,
      label: 'History',
      description: 'View transaction records',
      color: 'bg-rose-100 text-rose-600',
      hoverColor: 'hover:bg-rose-50',
      action: () => console.log('History clicked')
    },
    {
      icon: Plus,
      label: 'New Order',
      description: 'Create a new customer order',
      color: 'bg-violet-100 text-violet-600',
      hoverColor: 'hover:bg-violet-50',
      action: () => console.log('New Order clicked')
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