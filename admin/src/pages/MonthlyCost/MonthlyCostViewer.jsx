import React, { useState, useEffect } from 'react';
import { 
  monthlyMaintenanceCost, 
  filterByMonth, 
  filterByYear,
  updateMonthlyCost 
} from "../../services/api";

import ViewControls from '../../components/MonthlyCost/ViewControls';
import FilterPanel from '../../components/MonthlyCost/FilterPanel';
import StatsSummary from '../../components/MonthlyCost/StatsSummary';
import CostTable from '../../components/MonthlyCost/CostTable';
import CostChart from '../../components/MonthlyCost/CostChart';
import CostCards from '../../components/MonthlyCost/CostCards';
import LoadingState from '../../components/MonthlyCost/LoadingState';
import EmptyState from '../../components/MonthlyCost/EmptyState';
import ErrorMessage from '../../components/MonthlyCost/ErrorMessage';

const MonthlyCostViewer = () => {
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [view, setView] = useState('table');
  const [showYearlyTotal, setShowYearlyTotal] = useState(false);
  const [chartYear, setChartYear] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

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

  const handleUpdateMonthlyCost = async () => {
    try {
      setRefreshing(true);
      await updateMonthlyCost();
      showToast('Maintenance costs updated successfully!', 'success');
      fetchAllCosts();
    } catch (err) {
      setError('Failed to update maintenance costs');
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setError(type === 'error' ? message : null);
    if (type !== 'error') {
      const toast = document.createElement('div');
      toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
      } text-white z-50 animate-scaleIn`;
      toast.innerHTML = message;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.replace('animate-scaleIn', 'animate-fadeOut');
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
    }
  };

  const groupCostsByYear = () => {
    const grouped = {};
    costs.forEach(cost => {
      const year = cost.month.split('-')[0];
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(cost);
    });
    
    Object.keys(grouped).forEach(year => {
      grouped[year].sort((a, b) => a.month.localeCompare(b.month));
    });
    
    return grouped;
  };
  
  const getYearlyTotalForYear = (yearCosts) => {
    if (!yearCosts || !yearCosts.length) return 0;
    return yearCosts.reduce((total, cost) => total + Number(cost.totalCost), 0);
  };
  
  const getMonthlyAverageForYear = (yearCosts) => {
    if (!yearCosts || !yearCosts.length) return 0;
    return getYearlyTotalForYear(yearCosts) / yearCosts.length;
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

  useEffect(() => {
    fetchAllCosts();
  }, []);

  const getMonthName = (monthStr) => {
    if (!monthStr || monthStr.length !== 7) return monthStr;
    const monthNum = parseInt(monthStr.split('-')[1], 10);
    return new Date(0, monthNum - 1).toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 animate-fadeIn">
        <ViewControls 
          view={view} 
          setView={setView}
          refreshing={refreshing}
          handleUpdateMonthlyCost={handleUpdateMonthlyCost}
          hasData={costs.length > 0}
        />
        
        <FilterPanel 
          filter={filter}
          setFilter={setFilter}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          yearOptions={yearOptions}
          loading={loading}
          handleFilter={handleFilter}
          resetFilter={resetFilter}
          handleKeyPress={handleKeyPress}
        />

        {costs.length > 0 && (
          <StatsSummary 
            getYearlyTotal={getYearlyTotal}
            getMonthlyAverage={getMonthlyAverage}
            getHighestCost={getHighestCost}
            getLowestCost={getLowestCost}
            getMonthName={getMonthName}
          />
        )}

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <LoadingState />
        ) : costs.length === 0 && !error ? (
          <EmptyState resetFilter={resetFilter} />
        ) : (
          <>
            {view === 'table' && (
              <CostTable 
                groupCostsByYear={groupCostsByYear}
                getYearlyTotalForYear={getYearlyTotalForYear}
                getMonthName={getMonthName}
                showYearlyTotal={showYearlyTotal}
              />
            )}

            {view === 'chart' && (
              <CostChart 
                costs={costs}
                chartYear={chartYear}
                setChartYear={setChartYear}
                groupCostsByYear={groupCostsByYear}
                generateGradient={generateGradient}
              />
            )}

            {view === 'cards' && (
              <CostCards 
                groupCostsByYear={groupCostsByYear}
                getYearlyTotalForYear={getYearlyTotalForYear}
                getMonthlyAverageForYear={getMonthlyAverageForYear}
                getMonthName={getMonthName}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MonthlyCostViewer;