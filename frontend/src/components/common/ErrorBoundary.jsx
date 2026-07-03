import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-luxury-ivory dark:bg-luxury-charcoal px-6 text-center">
          <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-gray-900 dark:text-luxury-ivory">
            Something went wrong
          </h1>
          <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
            An unexpected error occurred. Try reloading the page — if the problem continues, please come back later.
          </p>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
