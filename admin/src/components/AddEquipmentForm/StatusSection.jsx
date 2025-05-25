import FormSection from './FormSection';

const StatusSection = ({ formData, handleChange, loading }) => {
  const sectionIcon = (
    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  );

  const statuses = [
    { value: 'AVAILABLE', label: 'Available', description: 'Equipment is ready for use' },
    { value: 'IN_USE', label: 'In Use', description: 'Currently being used' },
    { value: 'UNDER_MAINTENANCE', label: 'Under Maintenance', description: 'Being repaired or serviced' },
    { value: 'OUT_OF_ORDER', label: 'Out of Order', description: 'Not functioning properly' },
  ];

  return (
    <FormSection title="Equipment Status" icon={sectionIcon}>
      <fieldset className="mt-2 sm:mt-3">
        <legend className="sr-only">Equipment Status</legend>
        <div className="space-y-3 sm:space-y-4">
          {statuses.map((status) => (
            <div key={status.value} className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id={status.value}
                  name="status"
                  type="radio"
                  checked={formData.status === status.value}
                  value={status.value}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-4 w-4 border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor={status.value} className="font-medium text-gray-700 flex flex-col sm:flex-row sm:items-center cursor-pointer">
                  {status.label}
                  <span className="text-xs text-gray-500 font-normal sm:ml-2">{status.description}</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </fieldset>
    </FormSection>
  );
};

export default StatusSection;