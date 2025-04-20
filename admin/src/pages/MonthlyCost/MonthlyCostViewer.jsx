import React, { useState, useEffect, useRef } from 'react';
import { 
  monthlyMaintenanceCost, 
  filterByMonth, 
  filterByYear 
} from "../../services/api";

const MonthlyCostViewer = () => {
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [view, setView] = useState('table');
  const [showYearlyTotal, setShowYearlyTotal] = useState(false);
  const chartRef = useRef(null);

  const fetchAllCosts = async () => {
    try {
      setLoading(true);
      const response = await monthlyMaintenanceCost();
      const costsData = response.data;
      setCosts(costsData);
      
      const years = Array.from(new Set(costsData.map(cost => {
        const yearMonth = cost.month.split('-');
        return yearMonth[0];
      }))).sort((a, b) => b - a); 
      
      setYearOptions(years);
      setSelectedYear(years[0] || '');
      setError(null);
    } catch (err) {
      setError('Failed to fetch maintenance costs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    if (!filter) {
      fetchAllCosts();
      return;
    }

    try {
      setLoading(true);
      let response;
      
      if (/^\d{4}$/.test(filter)) {
        response = await filterByYear(filter);
        setCosts(response.data.length > 0 ? response.data : []);
        setError(response.data.length === 0 ? 'No results found for this year' : null);
      } 
      else if (/^\d{4}-\d{2}$/.test(filter)) {
        response = await filterByMonth(filter);
        setCosts(response.data ? [response.data] : []);
        setError(!response.data ? 'No results found for this month' : null);
      } 
      else {
        setError('Invalid format. Use YYYY for year or YYYY-MM for month');
        setCosts([]);
      }
    } catch (err) {
      setError('Failed to fetch filtered costs');
      console.error(err);
      setCosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  const resetFilter = () => {
    setFilter('');
    fetchAllCosts();
  };

  const drawChart = () => {
    if (!chartRef.current || costs.length === 0) return;
    
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const sortedCosts = [...costs].sort((a, b) => {
      return new Date(a.month + '-01') - new Date(b.month + '-01');
    });
    
    const maxCost = Math.max(...sortedCosts.map(c => Number(c.totalCost)));
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = Math.max(15, chartWidth / sortedCosts.length - 10);
    
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#CBD5E0';
    ctx.stroke();
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#4A5568';
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i * chartHeight / 5);
      const value = (maxCost * i / 5).toFixed(2);
      ctx.fillText('$' + value, padding - 35, y + 5);
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.strokeStyle = '#EDF2F7';
      ctx.stroke();
    }
    
    sortedCosts.forEach((cost, i) => {
      const x = padding + (i * (chartWidth / sortedCosts.length)) + (chartWidth / sortedCosts.length - barWidth) / 2;
      const costValue = Number(cost.totalCost);
      const barHeight = (costValue / maxCost) * chartHeight;
      const y = height - padding - barHeight;
      
      ctx.fillStyle = generateGradient(ctx, x, y, barWidth, barHeight);
      ctx.fillRect(x, y, barWidth, barHeight);
      
      ctx.fillStyle = '#2D3748';
      ctx.font = '10px Arial';
      ctx.fillText('$' + costValue.toFixed(2), x, y - 5);
      
      ctx.fillStyle = '#4A5568';
      ctx.font = '11px Arial';
      const label = cost.month.substring(5);
      ctx.fillText(label, x + barWidth / 2 - 8, height - padding + 15);
    });
  };
  
  const generateGradient = (ctx, x, y, width, height) => {
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, '#3182CE');
    gradient.addColorStop(1, '#2B6CB0');
    return gradient;
  };

  const getYearlyTotal = () => {
    if (!costs.length) return 0;
    return costs.reduce((total, cost) => total + Number(cost.totalCost), 0);
  };
  
  const getMonthlyAverage = () => {
    if (!costs.length) return 0;
    return getYearlyTotal() / costs.length;
  };
  
  const getHighestCost = () => {
    if (!costs.length) return { month: '-', cost: 0 };
    const highest = costs.reduce((max, cost) => 
      Number(cost.totalCost) > Number(max.totalCost) ? cost : max, costs[0]);
    return { month: highest.month, cost: Number(highest.totalCost) };
  };
  
  const getLowestCost = () => {
    if (!costs.length) return { month: '-', cost: 0 };
    const lowest = costs.reduce((min, cost) => 
      Number(cost.totalCost) < Number(min.totalCost) ? cost : min, costs[0]);
    return { month: lowest.month, cost: Number(lowest.totalCost) };
  };

  const exportToCSV = () => {
    if (!costs.length) return;
    
    const csvHeader = 'Month,Cost\n';
    const csvRows = costs.map(cost => `${cost.month},${cost.totalCost}`).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${csvHeader}${csvRows}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `maintenance_costs_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchAllCosts();
  }, []);
  
  useEffect(() => {
    if (view === 'chart') {
      drawChart();
    }
  }, [costs, view]);

  const getMonthName = (monthStr) => {
    if (!monthStr || monthStr.length !== 7) return monthStr;
    const monthNum = parseInt(monthStr.split('-')[1], 10);
    return new Date(0, monthNum - 1).toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Monthly Maintenance Costs
          </h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setView('table')}
              className={`p-2 rounded ${view === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition-colors duration-200`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={() => setView('chart')}
              className={`p-2 rounded ${view === 'chart' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition-colors duration-200`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </button>
            <button 
              onClick={() => setView('cards')}
              className={`p-2 rounded ${view === 'cards' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition-colors duration-200`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </button>
            <button 
              onClick={exportToCSV}
              disabled={costs.length === 0}
              className="p-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              title="Export to CSV"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Year (YYYY) or Month (YYYY-MM)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., 2025 or 2025-03"
                  className="w-full p-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  if (e.target.value) {
                    setFilter(e.target.value);
                  } else {
                    setFilter('');
                  }
                }}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Years</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 flex items-end">
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleFilter}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200 transform hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Filtering...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                      </svg>
                      Apply Filter
                    </span>
                  )}
                </button>
                <button
                  onClick={resetFilter}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 transform hover:scale-105 active:scale-95"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {costs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            {/* Yearly Total Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-bl-full"></div>
              <div className="flex items-start">
                <div>
                  <p className="text-blue-100 text-sm">Yearly Total</p>
                  <p className="text-2xl font-bold mt-1">${getYearlyTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-blue-100 mt-2">All months combined</p>
                </div>
                <div className="ml-auto bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Monthly Average Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-xl shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-bl-full"></div>
              <div className="flex items-start">
                <div>
                  <p className="text-indigo-100 text-sm">Monthly Average</p>
                  <p className="text-2xl font-bold mt-1">${getMonthlyAverage().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-indigo-100 mt-2">Average spend per month</p>
                </div>
                <div className="ml-auto bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Highest Cost Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-4 rounded-xl shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-bl-full"></div>
              <div className="flex items-start">
                <div>
                  <p className="text-orange-100 text-sm">Highest Monthly Cost</p>
                  <p className="text-2xl font-bold mt-1">${getHighestCost().cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-orange-100 mt-2">{getMonthName(getHighestCost().month)} {getHighestCost().month.split('-')[0]}</p>
                </div>
                <div className="ml-auto bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Lowest Cost Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-bl-full"></div>
              <div className="flex items-start">
                <div>
                  <p className="text-green-100 text-sm">Lowest Monthly Cost</p>
                  <p className="text-2xl font-bold mt-1">${getLowestCost().cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-green-100 mt-2">{getMonthName(getLowestCost().month)} {getLowestCost().month.split('-')[0]}</p>
                </div>
                <div className="ml-auto bg-white bg-opacity-20 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200 animate-scaleIn flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12 animate-pulse">
            <div className="inline-block rounded-full h-12 w-12 bg-blue-100 p-2">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-4 text-gray-600">Loading maintenance costs data...</p>
          </div>
        )}

        {!loading && costs.length === 0 && !error && (
          <div className="text-center py-12 bg-gray-50 rounded-lg animate-scaleIn">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-900">No maintenance costs found</h3>
            <p className="mt-2 text-base text-gray-500">Try changing your search criteria or resetting filters.</p>
            <button
              onClick={resetFilter}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105 active:scale-95 shadow-md"
            >
              View All Data
            </button>
          </div>
        )}

        {!loading && view === 'table' && costs.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <th className="p-4 font-semibold text-gray-700 border-b">Month</th>
                  <th className="p-4 font-semibold text-gray-700 border-b">Total Cost</th>
                  <th className="p-4 font-semibold text-gray-700 border-b">% of Year</th>
                </tr>
              </thead>
              <tbody>
                {costs.map((cost, index) => {
                  const yearlyTotal = getYearlyTotal();
                  const percentage = yearlyTotal > 0 ? (Number(cost.totalCost) / yearlyTotal) * 100 : 0;
                  
                  return (
                    <tr
                      key={cost.month || index}
                      className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="p-4 border-b border-gray-100">
                        <span className="font-medium text-gray-800">{getMonthName(cost.month)}</span>
                        <span className="text-gray-500 ml-2">{cost.month.split('-')[0]}</span>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <span className="font-bold text-gray-900">${Number(cost.totalCost).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}</span>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[200px]">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {showYearlyTotal && (
                  <tr className="bg-gray-100 font-semibold">
                    <td className="p-4 border-t-2 border-gray-300">Yearly Total</td>
                    <td className="p-4 border-t-2 border-gray-300">
                      ${getYearlyTotal().toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-4 border-t-2 border-gray-300">100%</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button 
                onClick={() => setShowYearlyTotal(!showYearlyTotal)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                {showYearlyTotal ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Hide Yearly Total
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Show Yearly Total
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {!loading && view === 'chart' && costs.length > 0 && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Monthly Cost Trends</h3>
            <div className="h-80 w-full relative">
              <canvas ref={chartRef} width="800" height="400" className="w-full h-full"></canvas>
            </div>
          </div>
        )}

        {!loading && view === 'cards' && costs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            {costs.map((cost, index) => {
              const costValue = Number(cost.totalCost);
              const yearlyTotal = getYearlyTotal();
              const percentage = yearlyTotal > 0 ? (costValue / yearlyTotal) * 100 : 0;
              const avgMonthly = getMonthlyAverage();
              const comparedToAvg = avgMonthly > 0 ? ((costValue - avgMonthly) / avgMonthly) * 100 : 0;
              
              return (
                <div 
                  key={cost.month || index}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{getMonthName(cost.month)}</h3>
                      <p className="text-sm text-gray-500">{cost.month}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      comparedToAvg > 10 ? 'bg-red-100 text-red-800' :
                      comparedToAvg < -10 ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {comparedToAvg > 0 ? '+' : ''}{comparedToAvg.toFixed(1)}% vs avg
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-900">${costValue.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</span>
                  </div>
                  
                  <div className="mb-1 flex justify-between items-center">
                    <span className="text-xs text-gray-500">% of Year</span>
                    <span className="text-xs font-medium text-gray-700">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        percentage > 20 ? 'bg-red-500' :
                        percentage > 10 ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyCostViewer;