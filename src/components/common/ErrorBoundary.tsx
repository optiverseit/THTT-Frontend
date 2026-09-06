import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught application error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50 font-sans">
          <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 text-center">
            {/* Warning Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-6 shadow-xs ring-8 ring-rose-50/50">
              <AlertTriangle size={32} />
            </div>

            {/* Title & Description */}
            <h2 className="text-2xl sm:text-3xl font-black text-[#2D1347] tracking-tight mb-2">
              Something Went Wrong
            </h2>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 max-w-md mx-auto">
              An unexpected error occurred while loading this page. Don't worry, your session is safe. You can refresh or return home.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#E91E63] hover:bg-pink-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <RefreshCw size={15} />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D1347] hover:bg-purple-900 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Home size={15} />
                <span>Return Home</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>Try Again</span>
              </button>
            </div>

            {/* Error Details (Collapsible in dev/debug) */}
            {this.state.error && (
              <div className="mt-6 pt-6 border-t border-gray-100 text-left">
                <button
                  type="button"
                  onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                  className="flex items-center justify-between w-full text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <span>Technical Error Details</span>
                  {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {this.state.showDetails && (
                  <div className="mt-3 p-4 bg-slate-900 text-rose-300 rounded-2xl text-[11px] font-mono leading-relaxed overflow-x-auto max-h-48 border border-slate-800">
                    <p className="font-bold text-white mb-1">{this.state.error.name}: {this.state.error.message}</p>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="text-gray-400 whitespace-pre-wrap text-[10px]">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
