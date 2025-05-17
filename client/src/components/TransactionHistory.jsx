import React from 'react';

const TransactionHistory = ({ transactions }) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-[30px] shadow-sm border border-gray-100 p-4 sm:p-5">
      <div className="flex justify-between items-center mb-4 sm:mb-5">
        <h2 className="text-base sm:text-lg font-semibold">Transaction History</h2>
        <button 
          className="text-gray-500 hover:bg-gray-100 p-1 rounded"
          aria-label="Add transaction"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="sm:w-5 sm:h-5"
          >
            <path d="M2 12h20M12 2v20" />
          </svg>
        </button>
      </div>
      
      <div>
        <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">Today</div>
        <div className="space-y-2 sm:space-y-3">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center py-2 sm:py-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                <span className="text-gray-600 font-medium text-sm sm:text-base">
                  {transaction.initial}
                </span>
              </div>
              <div className="flex-grow min-w-0">
                <div className="font-medium text-sm sm:text-base truncate">
                  {transaction.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {transaction.time}
                </div>
              </div>
              <div className={`text-sm sm:text-base font-medium whitespace-nowrap ml-2 ${
                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {transactions.length === 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          No transactions today
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;