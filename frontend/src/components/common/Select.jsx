import { forwardRef } from 'react';

const Select = forwardRef(({ label, error, options = [], placeholder, className = '', containerClassName = '', ...props }, ref) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      )}
      <select
        ref={ref}
        className={`w-full rounded-xl border bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/40 ${
          error ? 'border-red-400 focus:ring-red-400/40' : 'border-gray-300 dark:border-gray-700'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
