const FormSection = ({ title, icon, children }) => {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4 flex items-center">
          {icon}
          {title}
        </h2>
        {children}
      </div>
    );
  };
  
  export default FormSection;
  