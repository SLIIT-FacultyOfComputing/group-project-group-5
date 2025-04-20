import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const EditableCell = ({ 
  isEditing, 
  value, 
  editValue, 
  onEditChange, 
  onSave, 
  onEdit, 
  onCancel,
  inputType = 'text',
  inputProps = {},
  displayComponent,
  validation,
  isProcessing = false
}) => {
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      
      if (inputType === 'text' || inputType === 'number' || inputType === 'email') {
        inputRef.current.select();
      }
    }
  }, [isEditing, inputType]);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel?.() || onEdit();
    }
  };
  
  const handleSave = () => {
    if (validation) {
      const validationResult = validation(editValue);
      if (validationResult !== true) {
        setError(validationResult);
        return;
      }
    }
    setError('');
    onSave();
  };
  
  const renderInput = () => {
    const commonProps = {
      ref: inputRef,
      onChange: (e) => {
        onEditChange(e.target.value);
        if (error) setError('');
      },
      onKeyDown: handleKeyDown,
      disabled: isProcessing,
      className: `${error ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-2 rounded w-full focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`,
      ...inputProps
    };

    switch (inputType) {
      case 'select':
        return (
          <select
            value={editValue}
            {...commonProps}
          >
            {inputProps.options?.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            value={editValue}
            rows={3}
            {...commonProps}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={editValue}
            {...commonProps}
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={editValue}
              onChange={(e) => onEditChange(e.target.checked)}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              disabled={isProcessing}
              {...inputProps}
            />
            <span className="ml-2 text-sm text-gray-600">
              {inputProps.label || ''}
            </span>
          </div>
        );
      default:
        return (
          <input
            type={inputType}
            value={editValue}
            {...commonProps}
          />
        );
    }
  };
  
  const renderDisplay = () => {
    if (displayComponent) return displayComponent;
    
    if (inputType === 'checkbox') {
      return (
        <div className="flex items-center">
          <span className={`inline-block w-5 h-5 rounded border ${value ? 'bg-blue-500 border-blue-600' : 'bg-white border-gray-300'}`}>
            {value && (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </span>
          <span className="ml-2">{inputProps.label || ''}</span>
        </div>
      );
    }
    
    if (inputType === 'select') {
      const option = inputProps.options?.find(opt => opt.value === value);
      return <span>{option?.label || value}</span>;
    }
    
    return <span className="truncate">{value}</span>;
  };

  return isEditing ? (
    <div className="animate-scaleIn">
      <div className="flex gap-2 items-start">
        <div className="flex-grow">
          {renderInput()}
          {error && <p className="text-red-500 text-xs mt-1 animate-fadeIn">{error}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 transition-colors duration-300 shadow-sm flex items-center whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Save changes"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving
              </>
            ) : (
              'Save'
            )}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300 transition-colors duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      {inputType !== 'textarea' && (
        <div className="mt-1 text-xs text-gray-500">
          Press Enter to save, Esc to cancel
        </div>
      )}
    </div>
  ) : (
    <div className="flex justify-between items-center group py-1 relative">
      <div className="max-w-full overflow-hidden">
        {renderDisplay()}
      </div>
      <button
        onClick={onEdit}
        className="opacity-0 group-hover:opacity-100 absolute right-0 bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 active:bg-blue-700 transform active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg"
        aria-label="Edit"
      >
        <span className="flex items-center">
          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </span>
      </button>
    </div>
  );
};

EditableCell.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  value: PropTypes.any.isRequired,
  editValue: PropTypes.any.isRequired,
  onEditChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  inputType: PropTypes.oneOf(['text', 'number', 'email', 'password', 'textarea', 'select', 'date', 'checkbox']),
  inputProps: PropTypes.object,
  displayComponent: PropTypes.node,
  validation: PropTypes.func,
  isProcessing: PropTypes.bool
};

export default EditableCell;