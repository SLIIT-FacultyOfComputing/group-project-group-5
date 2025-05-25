import React from 'react';

const StatsSummary = ({ 
  getYearlyTotal, 
  getMonthlyAverage, 
  getHighestCost, 
  getLowestCost,
  getMonthName 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
      {/* Yearly Total Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-bl-full"></div>
        <div className="flex items-start">
          <div>
            <p className="text-blue-100 text-sm">Yearly Total</p>
            <p className="text-2xl font-bold mt-1">Rs{getYearlyTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
            <p className="text-2xl font-bold mt-1">Rs{getMonthlyAverage().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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
            <p className="text-2xl font-bold mt-1">Rs{getHighestCost().cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-xs text-orange-100 mt-2">{getMonthName(getHighestCost().month)} {getHighestCost().month?.split('-')[0]}</p>
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
            <p className="text-2xl font-bold mt-1">Rs{getLowestCost().cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-xs text-green-100 mt-2">{getMonthName(getLowestCost().month)} {getLowestCost().month?.split('-')[0]}</p>
          </div>
          <div className="ml-auto bg-white bg-opacity-20 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;