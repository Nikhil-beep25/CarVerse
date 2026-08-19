import React from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <div className="card shadow-sm border-0 mx-auto p-4" style={{ maxWidth: '600px' }}>
            <div className="card-body">
              <i className="bi bi-exclamation-triangle-fill text-warning fs-1 mb-3"></i>
              <h4 className="card-title text-danger">Something went wrong</h4>
              <p className="card-text text-muted mb-4">
                {this.state.error?.message || "An unexpected error occurred while rendering this page."}
              </p>
              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-outline-primary" onClick={this.handleReset}>
                  <i className="bi bi-arrow-clockwise me-1"></i> Try Again
                </button>
                <Link to="/admin" className="btn btn-primary" onClick={this.handleReset}>
                  <i className="bi bi-speedometer2 me-1"></i> Admin Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
