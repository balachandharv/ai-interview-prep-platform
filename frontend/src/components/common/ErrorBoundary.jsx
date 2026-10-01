import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-[var(--glass-bg-strong)] backdrop-blur-xl border border-[var(--glass-border)] rounded-3xl p-8 text-center shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-[rgba(239,68,68,0.1)] flex items-center justify-center mx-auto mb-6 text-[var(--danger-500)] shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <AlertTriangle size={32} />
            </div>
            
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] mb-3">Oops! Something went wrong.</h1>
            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
              We've encountered an unexpected error. Please try refreshing the page or navigating back home.
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.reload()} 
                className="flex-1 py-3 px-4 bg-[var(--aqua-400)] hover:bg-[var(--aqua-500)] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-[0_4px_12px_rgba(6,182,212,0.20)]"
              >
                <RefreshCcw size={18} /> Refresh
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="flex-1 py-3 px-4 bg-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.12)] text-[var(--text-primary)] font-bold rounded-xl transition-colors border border-[var(--glass-border)]"
              >
                Go Home
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 text-left bg-black/40 p-4 rounded-xl overflow-auto text-xs text-[var(--danger-500)] font-mono border border-[rgba(239,68,68,0.2)]">
                <p className="font-bold mb-2">{this.state.error.toString()}</p>
                <p className="whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</p>
              </div>
            )}
          </motion.div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
