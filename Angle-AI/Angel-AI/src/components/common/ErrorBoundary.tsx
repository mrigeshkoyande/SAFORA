import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught SAFORA runtime error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d0914] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <img src="/logo.png" alt="SAFORA Logo" className="w-10 h-10 object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-pink-400 mb-2">SAFORA Safety System</h1>
          <p className="text-gray-300 max-w-md mb-6 text-sm">
            An unexpected error occurred. The safety system was prevented from crashing completely.
          </p>
          <div className="bg-black/50 border border-gray-800 rounded-lg p-3 text-left font-mono text-xs text-red-300 max-w-lg w-full mb-6 overflow-auto max-h-40">
            {this.state.error?.toString()}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-pink-600/30"
          >
            Reload SAFORA App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
