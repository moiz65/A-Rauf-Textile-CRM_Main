import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer
} from 'recharts';
import { Download, Filter, MoreVertical, ChevronDown } from 'lucide-react';

const formatCurrency = (amt) => `PKR ${Number(amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const sampleMonthly = [
  { month: 'Jan', revenue: 120000, expenses: 90000 },
  { month: 'Feb', revenue: 150000, expenses: 110000 },
  { month: 'Mar', revenue: 140000, expenses: 95000 },
  { month: 'Apr', revenue: 180000, expenses: 120000 },
  { month: 'May', revenue: 200000, expenses: 145000 },
  { month: 'Jun', revenue: 220000, expenses: 160000 },
  { month: 'Jul', revenue: 210000, expenses: 180000 },
  { month: 'Aug', revenue: 230000, expenses: 170000 },
  { month: 'Sep', revenue: 240000, expenses: 200000 },
  { month: 'Oct', revenue: 260000, expenses: 215000 },
  { month: 'Nov', revenue: 280000, expenses: 225000 },
  { month: 'Dec', revenue: 300000, expenses: 250000 },
];

const CompanyFinancialProgress = () => {
  const [range, setRange] = useState('1y');
  const [showFilters, setShowFilters] = useState(false);

  const [data, setData] = useState(sampleMonthly);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // sample AR/AP
  const sampleReceivables = [
    { id: 'INV-501', name: 'Customer A', amount: 25000, due: '2025-12-28' },
    { id: 'INV-499', name: 'Customer B', amount: 12000, due: '2025-12-01' }
  ];
  const samplePayables = [
    { id: 'BILL-201', name: 'Supplier X', amount: 18000, due: '2025-12-05' },
    { id: 'BILL-198', name: 'Supplier Y', amount: 9000, due: '2025-11-30' }
  ];

  // Placeholder totals derived from sample
  const totals = {
    revenue: data.reduce((s, d) => s + (d.revenue || 0), 0),
    expenses: data.reduce((s, d) => s + (d.expenses || 0), 0),
  };
  const net = totals.revenue - totals.expenses;

  useEffect(() => {
    // Attempt to fetch real data from server endpoints if they exist
    // We'll attempt to fetch a combined endpoint then fallback to the sample
    const fetchData = async () => {
      setLoading(true);
      try {
        // Example endpoint: /api/dashboard/monthly-financials
        const res = await fetch('http://localhost:5000/api/dashboard/monthly-financials');
        if (!res.ok) throw new Error('No monthly financials API');
        const json = await res.json();
        if (json && json.data) {
          setData(json.data);
          setError(null);
        } else {
          setData(sampleMonthly);
        }
      } catch (err) {
        // if API not present, use sample data
        setData(sampleMonthly);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filtered = () => {
    // filter data for the requested range
    if (range === '3m') return data.slice(-3);
    if (range === '6m') return data.slice(-6);
    if (range === '1y') return data.slice(-12);
    return data;
  };

  const showData = filtered();

  return (
    <div className="flex bg-[#F5F5F5] min-h-screen p-4">
      <div className="hidden md:block fixed h-screen w-64 z-20">
        <Sidebar />
      </div>

      <main className="flex-1 p-6 bg-[#F5F5F5] md:ml-64">
        <Header />

        <div className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Company Financial Progress</h2>
              <p className="text-sm text-gray-500">At a glance progress of revenue, expenses and profitability</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setShowFilters(!showFilters)} className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">{range === '3m' ? '3 months' : range === '6m' ? '6 months' : range === '1y' ? '1 year' : 'All'}</span>
                  <ChevronDown className={`w-4 h-4 ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-md shadow-lg overflow-hidden z-10">
                    {['3m', '6m', '1y', 'all'].map((r) => (
                      <button key={r} onClick={() => { setRange(r); setShowFilters(false); }} className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${range===r ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}>
                        {r === '3m' ? '3 Months' : r === '6m' ? '6 Months' : r === '1y' ? '1 Year' : 'All Time'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>

              <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">Revenue</p>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totals.revenue)}</p>
            <p className="text-xs text-gray-500 mt-2">Period total</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">Expenses</p>
            <p className="text-2xl font-bold mt-2">{formatCurrency(totals.expenses)}</p>
            <p className="text-xs text-gray-500 mt-2">Period total</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">Net</p>
            <p className={`text-2xl font-bold mt-2 ${net >=0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(net)}</p>
            <p className="text-xs text-gray-500 mt-2">Profit / Loss</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500">Cash Flow</p>
            <p className="text-2xl font-bold mt-2">{formatCurrency((totals.revenue - totals.expenses) * 0.25)}</p>
            <p className="text-xs text-gray-500 mt-2">Est: 25%</p>
          </div>
        </div>

          {/* Profit & Loss and AR/AP */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Profit & Loss (Summary)</h3>
              <div className="space-y-2">
                {/* Compute COGS (assume part of total expenses) */}
                {(() => {
                  const revenue = totals.revenue || 0;
                  const expenses = totals.expenses || 0;
                  // Use a simple split of expenses into COGS and OPEX when breakdown isn't available
                  const cogs = Number((expenses * 0.6).toFixed(2));
                  const opex = Number((expenses - cogs).toFixed(2));
                  const gross = Number((revenue - cogs).toFixed(2));
                  const netProfit = Number((gross - opex).toFixed(2));
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">Revenue</div>
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(revenue)}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">Cost of Goods Sold (COGS)</div>
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(cogs)}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">Gross Profit</div>
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(gross)}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">Operating Expenses (OPEX)</div>
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(opex)}</div>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3">
                        <div className="text-sm text-gray-700 font-semibold">Net Profit</div>
                        <div className={`text-sm font-semibold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(netProfit)}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Receivables & Payables</h3>
              {(() => {
                // Provide sample AR/AP values if server data isn't available
                const receivables = Number((totals.revenue * 0.14).toFixed(2));
                const payables = Number((totals.expenses * 0.28).toFixed(2));
                const receivableCount = Math.max(0, Math.round(receivables / 1500));
                const payableCount = Math.max(0, Math.round(payables / 1200));
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Accounts Receivable</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(receivables)}</p>
                        <p className="text-xs text-gray-500">{receivableCount} invoices</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Accounts Payable</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(payables)}</p>
                        <p className="text-xs text-gray-500">{payableCount} bills</p>
                      </div>
                    </div>
                    <div>
                      <button className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Create Payment / Invoice</button>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-xs font-semibold text-gray-700 mb-2">Top Receivables</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <tbody>
                            {sampleReceivables.map(r => (
                              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-3 py-2 font-medium text-gray-900">{r.id}</td>
                                <td className="px-3 py-2 text-gray-600">{r.name}</td>
                                <td className="px-3 py-2 text-right font-medium">{formatCurrency(r.amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-2 mt-4">Top Payables</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <tbody>
                            {samplePayables.map(p => (
                              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-3 py-2 font-medium text-gray-900">{p.id}</td>
                                <td className="px-3 py-2 text-gray-600">{p.name}</td>
                                <td className="px-3 py-2 text-right font-medium">{formatCurrency(p.amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Revenue vs Expenses</h3>
                <p className="text-xs text-gray-500">Monthly view</p>
              </div>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={showData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `Rs${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => `PKR ${Number(v).toLocaleString()}`} />
                  <Line type="monotone" dataKey="revenue" stroke="#16A34A" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#EF4444" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Net Profit (Monthly)</h3>
                <p className="text-xs text-gray-500">Net per month</p>
              </div>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={showData} margin={{ top: 10, right: 4, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `Rs${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => `PKR ${Number(v).toLocaleString()}`} />
                  <Bar dataKey={(d) => d.revenue - d.expenses} name="Net" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent transactions / summary */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Recent Transactions</h3>
            <div className="text-xs text-gray-500">Latest 10</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Description</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Category</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">{new Date().toLocaleDateString()}</td>
                    <td className="px-4 py-3">Sample transaction #{i + 1}</td>
                    <td className="px-4 py-3">Sales</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(Math.round(Math.random() * 20000))}</td>
                    <td className="px-4 py-3 text-left"><span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">Completed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default CompanyFinancialProgress;
