import React from 'react';

const TransactionHistory = ({ transactions }) => {
  const hasTransactions = transactions && transactions.length > 0;

  return (
    <section
      className="bg-white rounded-xl sm:rounded-[30px] shadow-md border border-gray-200 p-4 sm:p-6"
      aria-label="Transaction History"
    >
      <header className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>
        <button
          className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
          aria-label="Add Transaction"
          title="Add Transaction"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </header>

      <div>
        <h3 className="text-sm text-gray-500 font-medium mb-3">Today</h3>

        {hasTransactions ? (
          <ul className="space-y-3">
            {transactions.map((txn) => (
              <li
                key={txn.id}
                className="flex items-center py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-semibold mr-4">
                  {txn.initial}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="text-sm sm:text-base font-medium text-gray-800 truncate">
                    {txn.name}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">{txn.time}</div>
                </div>
                <div
                  className={`text-sm sm:text-base font-semibold ml-3 ${
                    txn.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {txn.type === 'income' ? '+' : '-'}
                  {txn.amount}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-2 w-6 h-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            No transactions today
          </div>
        )}
      </div>
    </section>
  );
};

export default TransactionHistory;
