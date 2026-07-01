import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', containerClassName = '', ...props }, ref) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />}
        <input
          ref={ref}
          className={`w-full rounded-xl border bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/40 ${
            Icon ? 'pl-9' : ''
          } ${error ? 'border-red-400 focus:ring-red-400/40' : 'border-gray-300 dark:border-gray-700'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
