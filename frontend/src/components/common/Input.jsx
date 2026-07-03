import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      type = 'text',
      className = '',
      containerClassName = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={containerClassName}>
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          )}

          <input
            ref={ref}
            type={inputType}
            className={`
              w-full rounded-xl border bg-white/90 px-4 py-2 text-sm
              text-gray-900 placeholder:text-gray-400/80
              transition-all duration-200 shadow-sm
              focus:outline-none focus:ring-4 focus:ring-primary-500/10
              dark:border-gray-800 dark:bg-luxury-deep/90 dark:text-gray-100
              ${
                Icon ? 'pl-10' : ''
              }
              ${
                isPasswordType ? 'pr-10' : ''
              }
              ${
                error
                  ? 'border-red-400 focus:ring-red-400/20'
                  : 'border-gray-200 dark:border-gray-800/80 focus:border-primary-500 focus:ring-primary-500/10'
              }
              ${className}
            `}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-1 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;