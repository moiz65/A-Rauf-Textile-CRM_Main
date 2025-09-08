import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, CartesianGrid } from 'recharts';
import { ArrowUpRight, MoreVertical, Download, Filter, ChevronDown } from 'lucide-react';

const ExpenseChart = ({ showControls = true }) => {
  const [timeRange, setTimeRange] = useState('1y');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeDataset, setActiveDataset] = useState(new Date().getFullYear().toString());
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from MySQL database
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/expenses-chart');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the data to match the expected format
        const transformedData = transformChartData(data);
        setChartData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Transform the API data to match the chart's expected format
  const transformChartData = (apiData) => {
    // Group data by year and month
    const groupedByYear = {};
    
    apiData.forEach(item => {
      const year = item.year.toString();
      const month = item.month;
      
      if (!groupedByYear[year]) {
        groupedByYear[year] = Array(12).fill(0).map((_, i) => ({
          month: new Date(0, i).toLocaleString('default', { month: 'short' }),
          year: year,
          amount: 0,
          count: 0,
          trend: 'stable'
        }));
      }
      
      // Update the month data
      if (month >= 1 && month <= 12) {
        const monthIndex = month - 1;
        groupedByYear[year][monthIndex].amount += parseFloat(item.total) || 0;
        groupedByYear[year][monthIndex].count += item.count || 0;
      }
    });
    
    // Calculate trends (up/down) for each month
    Object.keys(groupedByYear).forEach(year => {
      const yearData = groupedByYear[year];
      for (let i = 1; i < yearData.length; i++) {
        if (yearData[i].amount > yearData[i-1].amount) {
          yearData[i].trend = 'up';
        } else if (yearData[i].amount < yearData[i-1].amount) {
          yearData[i].trend = 'down';
        } else {
          yearData[i].trend = 'stable';
        }
      }
    });
    
    return groupedByYear;
  };

  // Filter data based on selected time range and active dataset
  const getFilteredData = () => {
    if (!chartData || !chartData[activeDataset]) return [];
    
    const yearData = chartData[activeDataset];
    
    const now = new Date();
    const currentMonthIndex = now.getMonth(); // 0-11
    
    switch(timeRange) {
      case '3m':
        const startMonth3m = (currentMonthIndex - 2 + 12) % 12;
        return yearData.slice(startMonth3m, startMonth3m + 3);
      case '6m':
        const startMonth6m = (currentMonthIndex - 5 + 12) % 12;
        return yearData.slice(startMonth6m, startMonth6m + 6);
      case '1y':
        return yearData;
      case 'all':
      default:
        // Combine all available years
        return Object.values(chartData).flat();
    }
  };

  const data = getFilteredData();
  
  // Get available years for dataset selection
  const availableYears = chartData ? Object.keys(chartData).sort() : [];

  // Handle case when data is not available
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 w-full transition-all hover:shadow-sm group relative">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 w-full transition-all hover:shadow-sm group relative">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-center">
            <div>{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 w-full transition-all hover:shadow-sm group relative">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">No expense data available</div>
        </div>
      </div>
    );
  }

  const currentMonth = data[data.length - 1];
  const prevMonth = data.length > 1 ? data[data.length - 2] : null;
  const changePercentage = prevMonth && prevMonth.amount > 0 
    ? ((currentMonth.amount - prevMonth.amount) / prevMonth.amount * 100).toFixed(1) 
    : 0;
  const isPositive = prevMonth ? currentMonth.amount >= prevMonth.amount : true;

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    setShowFilterMenu(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 w-full transition-all hover:shadow-sm group relative">
      {/* Header with enhanced controls */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Monthly Expenses</h3>
          <h2 className="text-2xl font-bold text-gray-900">Spending Overview</h2>
        </div>
        
        {showControls && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <Filter className="w-4 h-4" />
                <span className="text-xs hidden sm:inline-block capitalize">{timeRange}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilterMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-10 overflow-hidden">
                  {['3m', '6m', '1y', 'all'].map((range) => (
                    <button
                      key={range}
                      onClick={() => handleTimeRangeChange(range)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        timeRange === range ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {range === '3m' ? '3 Months' : 
                       range === '6m' ? '6 Months' : 
                       range === '1y' ? '1 Year' : 'All Time'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Enhanced chart with gradient and tooltip */}
      <div className="h-64 mb-6 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6B7280' }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#6B7280' }}
              tickFormatter={(value) => `Rs${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '8px 12px'
              }}
              formatter={(value) => [`Rs${value.toLocaleString()}`, "Amount"]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#3B82F6" 
              fill="url(#colorAmount)" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={({ cx, cy, payload }) => (
                <g>
                  <circle cx={cx} cy={cy} r={4} fill="#3B82F6" />
                  {payload.trend === 'up' && (
                    <ArrowUpRight 
                      x={cx - 6} 
                      y={cy - 6} 
                      width={12} 
                      height={12} 
                      fill="#10B981" 
                      className="inline-block"
                    />
                  )}
                  {payload.trend === 'down' && (
                    <ArrowUpRight 
                      x={cx - 6} 
                      y={cy - 6} 
                      width={12} 
                      height={12} 
                      fill="#EF4444" 
                      className="inline-block rotate-180"
                    />
                  )}
                </g>
              )}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#FFFFFF' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced summary section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              Rs{currentMonth.amount.toLocaleString()}
            </span>
            {prevMonth && prevMonth.amount > 0 && (
              <span className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
                isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {isPositive ? '+' : ''}{changePercentage}%
                <ArrowUpRight className={`w-3 h-3 ml-1 ${
                  isPositive ? 'text-green-600 rotate-0' : 'text-red-600 rotate-180'
                }`} />
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {prevMonth && prevMonth.amount > 0 
              ? `${isPositive ? 'Increase' : 'Decrease'} from previous month` 
              : 'No comparison data available'}
          </p>
        </div>

        {availableYears.length > 0 && (
          <div className="flex items-center gap-3">
            {availableYears.map(year => (
              <button 
                key={year}
                onClick={() => setActiveDataset(year)}
                className="flex items-center gap-1.5 cursor-pointer group"
              >
                <div className={`w-3 h-3 rounded-full transition-colors ${
                  activeDataset === year ? 'bg-blue-500' : 'bg-gray-200'
                }`}></div>
                <span className="text-xs text-gray-500 group-hover:text-gray-700">{year}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;