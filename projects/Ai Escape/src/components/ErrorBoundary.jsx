import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Error Boundary Component - Catches JavaScript errors anywhere in the component tree
 * Prevents TLS-like errors from showing in iOS Safari
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('❌ Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Check if it's a Firebase/network error
    const isNetworkError = 
      error.message?.includes('Firebase') ||
      error.message?.includes('network') ||
      error.message?.includes('fetch') ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('TLS') ||
      error.message?.includes('SSL') ||
      error.message?.includes('connection');

    if (isNetworkError) {
      console.error('🔴 Network/Firebase error detected - preventing TLS error display');
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const error = this.state.error;
      const isFirebaseError = error?.message?.includes('Firebase');
      const isNetworkError = 
        error?.message?.includes('network') ||
        error?.message?.includes('fetch') ||
        error?.message?.includes('Failed to fetch');
      const isTLSError = 
        error?.message?.includes('TLS') ||
        error?.message?.includes('SSL');

      return (
        <div className="viewport-container flex items-center justify-center cyber-grid">
          <div className="card max-w-2xl mx-4 p-6">
            <div className="text-center">
              <AlertTriangle className="text-cyber-danger mx-auto mb-4" size={64} />
              
              <h1 className="text-2xl md:text-4xl font-bold text-cyber-danger mb-4">
                {isFirebaseError || isNetworkError || isTLSError
                  ? 'Connection Error'
                  : 'Something Went Wrong'}
              </h1>

              {isFirebaseError && (
                <div className="mb-6">
                  <p className="text-base md:text-lg text-white mb-3">
                    Unable to connect to game servers.
                  </p>
                  <div className="bg-cyber-surface p-4 rounded-lg text-left mb-4">
                    <p className="text-sm text-white text-opacity-80 mb-2">
                      <strong>Possible causes:</strong>
                    </p>
                    <ul className="text-sm text-white text-opacity-70 space-y-1">
                      <li>• Check your internet connection</li>
                      <li>• Firebase services might be down</li>
                      <li>• App configuration is incomplete</li>
                    </ul>
                  </div>
                </div>
              )}

              {(isNetworkError || isTLSError) && !isFirebaseError && (
                <div className="mb-6">
                  <p className="text-base md:text-lg text-white mb-3">
                    Network connection failed.
                  </p>
                  <div className="bg-cyber-surface p-4 rounded-lg text-left mb-4">
                    <p className="text-sm text-white text-opacity-80 mb-2">
                      <strong>Try these steps:</strong>
                    </p>
                    <ul className="text-sm text-white text-opacity-70 space-y-1">
                      <li>• Check your internet connection</li>
                      <li>• Disable VPN if using one</li>
                      <li>• Try switching between WiFi and cellular</li>
                      <li>• Clear browser cache and reload</li>
                    </ul>
                  </div>
                </div>
              )}

              {!isFirebaseError && !isNetworkError && !isTLSError && (
                <div className="mb-6">
                  <p className="text-base md:text-lg text-white mb-4">
                    The app encountered an unexpected error.
                  </p>
                  {import.meta.env.DEV && (
                    <div className="bg-cyber-surface p-4 rounded-lg text-left mb-4">
                      <p className="text-xs text-cyber-danger font-mono break-words">
                        {error?.toString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReload}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} />
                  Reload Page
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="btn-secondary flex items-center justify-center gap-2"
                >
                  <Home size={20} />
                  Go Home
                </button>
              </div>

              <p className="text-xs text-white text-opacity-50 mt-6">
                If the problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
