import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: Record<string, unknown>) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundaryWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: Record<string, unknown>) {
    console.error('ErrorBoundaryWrapper caught an error:', error, errorInfo);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback or default fallback
      return this.props.fallback || (
        <div className="p-4 text-center">
          <p className="text-gray-500">Something went wrong. Please try again.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
