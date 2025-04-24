import React from 'react';

const FilterPanel = ({ 
  filter, 
  setFilter, 
  selectedYear, 
  setSelectedYear, 
  yearOptions, 
  loading, 
  handleFilter, 
  resetFilter,
}) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      <div className="flex-1">

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Year
          </label>
          <select
            value={selectedYear || ""}
            onChange={(e) => {
              const newYear = e.target.value;
              setSelectedYear(newYear);
              setFilter(newYear);
            }}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Years</option>
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Month
          </label>
          <select
            value={filter.length > 4 ? filter.substring(5) : ""}
            onChange={(e) => {
              if (e.target.value) {
                const yearPrefix = selectedYear || new Date().getFullYear();
                setFilter(`${yearPrefix}-${e.target.value}`);
              } else {
                setFilter(selectedYear || '');
              }
            }}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Months</option>
            <option value="01">01 (January)</option>
            <option value="02">02 (February)</option>
            <option value="03">03 (March)</option>
            <option value="04">04 (April)</option>
            <option value="05">05 (May)</option>
            <option value="06">06 (June)</option>
            <option value="07">07 (July)</option>
            <option value="08">08 (August)</option>
            <option value="09">09 (September)</option>
            <option value="10">10 (October)</option>
            <option value="11">11 (November)</option>
            <option value="12">12 (December)</option>
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
  );
};

export default FilterPanel;