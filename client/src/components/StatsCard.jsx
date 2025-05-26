import React from 'react';
import { ArrowUp, ArrowDown, Minus, TrendingUp, TrendingDown, Activity, MoreHorizontal } from 'lucide-react';

const StatsCard = ({ 
  title, 
  amount, 
  currency = 'PKR', 
  change, 
  changeType = 'neutral',
  icon,
  color = 'blue',
  trendData,
  loading = false,
  onClick,
  isInteractive = false,
  showMenu = false,
  onMenuClick
}) => {
  // Enhanced color configurations with gradients and shades
  const colorConfig = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      gradient: 'from-blue-500 to-blue-600',
      border: 'border-blue-100',
      accent: 'bg-blue-100',
      accentText: 'text-blue-800'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      gradient: 'from-green-500 to-green-600',
      border: 'border-green-100',
      accent: 'bg-green-100',
      accentText: 'text-green-800'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      gradient: 'from-red-500 to-red-600',
      border: 'border-red-100',
      accent: 'bg-red-100',
      accentText: 'text-red-800'
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      gradient: 'from-yellow-500 to-yellow-600',
      border: 'border-yellow-100',
      accent: 'bg-yellow-100',
      accentText: 'text-yellow-800'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      gradient: 'from-purple-500 to-purple-600',
      border: 'border-purple-100',
      accent: 'bg-purple-100',
      accentText: 'text-purple-800'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      gradient: 'from-indigo-500 to-indigo-600',
      border: 'border-indigo-100',
      accent: 'bg-indigo-100',
      accentText: 'text-indigo-800'
    }
  };

  // Enhanced change type configurations
  const changeConfig = {
    up: {
      icon: ArrowUp,
      trendIcon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-100'
    },
    down: {
      icon: ArrowDown,
      trendIcon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-100'
    },
    neutral: {
      icon: Minus,
      trendIcon: Activity,
      color: 'text-gray-500',
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      border: 'border-gray-100'
    }
  };

  const ChangeIcon = changeConfig[changeType].icon;
  const TrendIcon = changeConfig[changeType].trendIcon;

  // Format large numbers with better precision
  const formatAmount = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(value % 1000000000 === 0 ? 0 : 1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
    }
    return value.toLocaleString();
  };

  // Format currency symbol
  const currencySymbols = {
    PKR: '₨',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  const currencySymbol = currencySymbols[currency] || currency;

  return (
    <div 
      className={`relative bg-white rounded-xl p-5 shadow-xs border transition-all w-full h-[220px] flex flex-col group
        ${colorConfig[color].border} 
        ${isInteractive ? 'cursor-pointer hover:shadow-md hover:border-opacity-70' : ''}
        ${onClick ? 'hover:scale-[1.02] transition-transform duration-200' : ''}
      `}
      onClick={onClick}
    >
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-xl z-10 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Header section */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {title}
          </h3>
          {showMenu && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onMenuClick?.();
              }}
              className="mt-1 p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {trendData && (
            <div className={`p-2 rounded-lg ${changeConfig[changeType].bg} ${changeConfig[changeType].border}`}>
              <TrendIcon className={`w-4 h-4 ${changeConfig[changeType].color}`} />
            </div>
          )}
          {icon && (
            <div className={`p-2 rounded-lg ${colorConfig[color].bg} ${colorConfig[color].text}`}>
              {React.cloneElement(icon, { className: 'w-5 h-5' })}
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-end gap-2 mb-2">
          <span className="text-2xl font-semibold text-gray-400">
            {currencySymbol}
          </span>
          <span className="text-4xl font-bold text-gray-900">
            {formatAmount(amount)}
          </span>
        </div>
        
        {change && (
          <div className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full ${changeConfig[changeType].bg} ${changeConfig[changeType].border}`}>
            <ChangeIcon className={`w-4 h-4 ${changeConfig[changeType].color}`} />
            <span className={`text-sm font-medium ${changeConfig[changeType].text}`}>
              {change}
            </span>
            <span className="text-xs text-gray-500">
              vs last period
            </span>
          </div>
        )}
      </div>
      
      {/* Footer section */}
      {trendData && (
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <Activity className="w-3 h-3" />
              <span>Trend: {trendData}</span>
            </div>
            <div className={`text-xs px-2 py-1 rounded ${colorConfig[color].accent} ${colorConfig[color].accentText}`}>
              View details
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;