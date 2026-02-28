import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show fallback UI
    return { hasError: true, error, errorInfo };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any component below and re-render with error message
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{
          padding: '20px',
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#fee',
          color: '#721c24',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '50px auto'
        }}>
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
            {this.state.error && this.state.error.toString()}
          </details>
          <p style={{ marginTop: '10px' }}>
            Please refresh the page and try again. If the problem persists, contact support.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
