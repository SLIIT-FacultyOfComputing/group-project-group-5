import React from 'react';

const CostCards = ({ 
  groupCostsByYear, 
  getYearlyTotalForYear, 
  getMonthlyAverageForYear, 
}) => {
  return (
    <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
      {Object.entries(groupCostsByYear())
        .sort((a, b) => b[0] - a[0])
        .map(([year, yearCosts]) => (
        <div key={year} className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
            Year {year} - Rs:{getYearlyTotalForYear(yearCosts).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {yearCosts.map((cost, index) => {
              const costValue = Number(cost.totalCost);
              const yearlyTotal = getYearlyTotalForYear(yearCosts);
              const percentage = yearlyTotal > 0 ? (costValue / yearlyTotal) * 100 : 0;
              const avgMonthly = getMonthlyAverageForYear(yearCosts);
              const comparedToAvg = avgMonthly > 0 ? ((costValue - avgMonthly) / avgMonthly) * 100 : 0;
              
              return (
                <div 
                  key={cost.month || index}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{year}-{
                        typeof cost.month === 'string' && cost.month.includes('-') 
                          ? cost.month.split('-')[1] 
                          : String(cost.month).padStart(2, '0')
                      }</h3>
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
                    <span className="text-2xl font-bold text-gray-900">Rs:{costValue.toLocaleString('en-US', {
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
        </div>
      ))}
    </div>
  );
};

export default CostCards;