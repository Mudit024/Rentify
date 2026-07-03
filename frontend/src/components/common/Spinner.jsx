import { Loader2 } from 'lucide-react';

const SIZES = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const Spinner = ({
  size = 'md',
  className = '',
  fullPage = false,
}) => {
  const spinner = (
    <Loader2
      className={`animate-spin text-primary-600 ${SIZES[size]} ${className}`}
    />
  );

  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;