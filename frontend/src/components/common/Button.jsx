import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-premium',
  gold: 'bg-luxury-gold text-luxury-charcoal hover:bg-luxury-gold/90',
  outline: 'border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const SIZES = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-full font-medium transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500/40
          disabled:cursor-not-allowed disabled:opacity-50
          ${VARIANTS[variant]}
          ${SIZES[size]}
          ${className}
        `}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}

        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;