import React from 'react';

const TransactionHistory = () => {
  // Sample transactions data
  const transactions = [
    {
      id: 1,
      name: "Grocery Store",
      amount: 2500.50,
      type: "expense",
      time: "10:30 AM",
      initial: "GS"
    },
    {
      id: 2,
      name: "Freelance Payment",
      amount: 15000,
      type: "income",
      time: "2:15 PM",
      initial: "FP"
    },
    {
      id: 3,
      name: "Electricity Bill",
      amount: 4500.75,
      type: "expense",
      time: "4:45 PM",
      initial: "EB"
    }
  ];

  const formatCurrency = (amount) => {
    return 'Rs ' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Transaction History</h2>
        <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div>
        <h3 className="text-sm text-gray-500 mb-3">Recent Transactions</h3>
        
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <span className="font-medium text-gray-700">{txn.initial}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{txn.name}</p>
                  <p className="text-xs text-gray-500">{txn.time}</p>
                </div>
                <div className={`text-sm font-semibold ${
                  txn.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {txn.type === 'income' ? '+' : '-'}
                  {formatCurrency(txn.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <svg className="mx-auto h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <p className="mt-2 text-sm">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;