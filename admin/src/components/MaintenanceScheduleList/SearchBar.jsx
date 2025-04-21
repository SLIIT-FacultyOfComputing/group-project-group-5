import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({ 
  searchTerm, 
  onSearchTermChange, 
  onSearch, 
  placeholder = "Search...",
  statusFilter,
  onStatusFilterChange,
  statusOptions = [],
  recentSearches = [],
  onSaveSearch,
  onClearSearch,
  onAdvancedSearch,
  isAdvancedMode = false,
  advancedFilters = {},
  onAdvancedFilterChange
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const searchInputRef = useRef(null);
  const historyRef = useRef(null);
  const tipsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (historyRef.current && !historyRef.current.contains(event.target)) {
        setShowHistory(false);
      }
      if (tipsRef.current && !tipsRef.current.contains(event.target)) {
        setShowTips(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
      setShowHistory(false);
    } else if (e.key === 'Escape') {
      searchInputRef.current.blur();
      setShowHistory(false);
    }
  };

  const applySearch = (term) => {
    onSearchTermChange(term);
    onSearch();
    setShowHistory(false);
  };

  const getStatusColor = (value) => {
    switch (value) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INPROGRESS':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'OVERDUE':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (value) => {
    switch (value) {
      case 'COMPLETED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'INPROGRESS':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        );
      case 'SCHEDULED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        );
      case 'CANCELLED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'OVERDUE':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6 animate-slideIn transition-all duration-300">
      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowHistory(recentSearches.length > 0)}
                placeholder={placeholder}
                className="w-full p-3 pl-10 pr-20 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow"
                aria-label="Search"
              />
              
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                {searchTerm && (
                  <button 
                    onClick={() => {
                      onSearchTermChange('');
                      onClearSearch?.();
                      searchInputRef.current.focus();
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
                    aria-label="Clear search"
                    title="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                
                <button 
                  onClick={() => setShowTips(!showTips)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
                  aria-label="Search tips"
                  title="Search tips"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {recentSearches?.length > 0 && (
                  <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
                    aria-label="Recent searches"
                    title="Recent searches"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            {showHistory && (
              <div 
                ref={historyRef}
                className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 py-1 animate-scaleIn origin-top"
                style={{ maxHeight: '300px', overflowY: 'auto' }}
              >
                <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">Recent searches</div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => applySearch(search)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {search}
                    </div>
                  </button>
                ))}
                <div className="border-t border-gray-100 px-3 py-1">
                  <button 
                    onClick={() => {
                      onSaveSearch?.();
                      setShowHistory(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    Save current search
                  </button>
                </div>
              </div>
            )}
            
            {showTips && (
              <div 
                ref={tipsRef}
                className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 py-2 px-4 animate-scaleIn origin-top"
              >
                <h4 className="font-medium text-gray-700 mb-2">Search Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                  <li>Press <kbd className="bg-gray-100 px-1 rounded">Enter</kbd> to search</li>
                  <li>Press <kbd className="bg-gray-100 px-1 rounded">/</kbd> anywhere to focus search</li>
                  <li>Use quotes for exact phrase: <code className="bg-gray-100 px-1 rounded">"oil change"</code></li>
                  <li>Filter by ID: <code className="bg-gray-100 px-1 rounded">id:123</code></li>
                  <li>Filter by type: <code className="bg-gray-100 px-1 rounded">type:routine</code></li>
                  <li>Filter by date: <code className="bg-gray-100 px-1 rounded">date:2025-03</code></li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onSearch}
              className="flex-shrink-0 bg-blue-600 text-white px-4 py-2.5 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center shadow-sm hover:shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search</span>
            </button>
            
            <button
              onClick={() => onAdvancedSearch && onAdvancedSearch()}
              className={`flex-shrink-0 px-4 py-2.5 rounded-md text-sm font-medium flex items-center ${
                isAdvancedMode 
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              } transition-colors duration-200`}
              title="Toggle advanced search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Advanced
            </button>
          </div>
        </div>
        
        {statusOptions.length > 0 && (
          <div className="mt-3 flex space-x-1 overflow-x-auto pb-1 no-scrollbar">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => onStatusFilterChange(option.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border whitespace-nowrap transition-all duration-150 flex items-center ${
                  statusFilter === option.value 
                    ? getStatusColor(option.value) + ' shadow-sm' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {statusFilter === option.value && (
                  <span className="mr-1.5">{getStatusIcon(option.value)}</span>
                )}
                {option.label}
              </button>
            ))}
          </div>
        )}
        
        {(searchTerm || statusFilter !== 'ALL' || 
          (advancedFilters && Object.keys(advancedFilters).some(key => advancedFilters[key]))) && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-gray-600">
            <span className="font-medium">Active:</span>
            
            {searchTerm && (
              <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md flex items-center">
                <span className="mr-1">Search:</span>
                <span className="font-medium max-w-[100px] truncate">{searchTerm}</span>
                <button 
                  onClick={() => {
                    onSearchTermChange('');
                    onSearch();
                  }}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                  aria-label="Remove search term filter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            
            {statusFilter !== 'ALL' && (
              <div className={`px-2 py-1 rounded-md flex items-center ${getStatusColor(statusFilter)}`}>
                <span className="mr-1">Status:</span>
                <span className="font-medium">
                  {statusOptions.find(o => o.value === statusFilter)?.label || statusFilter}
                </span>
                <button 
                  onClick={() => {
                    onStatusFilterChange('ALL');
                    onSearch();
                  }}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                  aria-label="Remove status filter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
            
            {advancedFilters && Object.entries(advancedFilters).map(([key, value]) => {
              if (!value) return null;
              return (
                <div key={key} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md flex items-center">
                  <span className="mr-1">{key}:</span>
                  <span className="font-medium max-w-[80px] truncate">{value}</span>
                  <button 
                    onClick={() => {
                      const newFilters = {...advancedFilters};
                      delete newFilters[key];
                      onAdvancedFilterChange(newFilters);
                      onSearch();
                    }}
                    className="ml-1 text-indigo-500 hover:text-indigo-700"
                    aria-label={`Remove ${key} filter`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              );
            })}
            
            <button
              onClick={() => {
                onSearchTermChange('');
                onStatusFilterChange('ALL');
                if (onAdvancedFilterChange) onAdvancedFilterChange({});
                onSearch();
              }}
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      
      {isAdvancedMode && onAdvancedFilterChange && (
        <div className="border-t border-gray-200 animate-fadeIn">
          <div className="p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">Advanced Search Options</h3>
              <button
                onClick={() => onAdvancedSearch(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Equipment Type</label>
                <select
                  value={advancedFilters.type || ''}
                  onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, type: e.target.value })}
                  className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                >
                  <option value="">Any Type</option>
                  <option value="MECHANICAL">Mechanical</option>
                  <option value="ELECTRICAL">Electrical</option>
                  <option value="PLUMBING">Plumbing</option>
                  <option value="HVAC">HVAC</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cost Range</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={advancedFilters.costMin || ''}
                    onChange={(e) => onAdvancedFilterChange({ 
                      ...advancedFilters, 
                      costMin: e.target.value
                    })}
                    className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={advancedFilters.costMax || ''}
                    onChange={(e) => onAdvancedFilterChange({ 
                      ...advancedFilters, 
                      costMax: e.target.value
                    })}
                    className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Technician</label>
                <input
                  type="text"
                  placeholder="Technician name"
                  value={advancedFilters.technician || ''}
                  onChange={(e) => onAdvancedFilterChange({ ...advancedFilters, technician: e.target.value })}
                  className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => onAdvancedFilterChange({})}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50"
              >
                Reset Filters
              </button>
              <button
                onClick={() => {
                  onSearch();
                }}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-2 text-xs text-center text-gray-500 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Press <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-sans text-xs">Tab</kbd> to navigate, <kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-sans text-xs">/</kbd> to focus search
        </div>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchTermChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  statusFilter: PropTypes.string,
  onStatusFilterChange: PropTypes.func,
  statusOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })),
  recentSearches: PropTypes.arrayOf(PropTypes.string),
  onSaveSearch: PropTypes.func,
  onClearSearch: PropTypes.func,
  onAdvancedSearch: PropTypes.func,
  isAdvancedMode: PropTypes.bool,
  advancedFilters: PropTypes.object,
  onAdvancedFilterChange: PropTypes.func
};

export default SearchBar;