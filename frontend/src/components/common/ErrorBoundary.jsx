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
            className="max-w-md w-full bg-[rgba(30,41,59,0.8)] backdrop-blur-xl border border-[rgba(148,163,184,0.1)] rounded-3xl p-8 text-center shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-[rgba(239,68,68,0.1)] flex items-center justify-center mx-auto mb-6 text-[#EF4444] shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <AlertTriangle size={32} />
            </div>
            
            <h1 className="text-2xl font-extrabold text-[#F1F5F9] mb-3">Oops! Something went wrong.</h1>
            <p className="text-[#94A3B8] mb-8 leading-relaxed">
              We've encountered an unexpected error. Please try refreshing the page or navigating back home.
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.reload()} 
                className="flex-1 py-3 px-4 bg-[#818CF8] hover:bg-[#6366F1] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-[0_4px_12px_rgba(129,140,248,0.3)]"
              >
                <RefreshCcw size={18} /> Refresh
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="flex-1 py-3 px-4 bg-[rgba(148,163,184,0.1)] hover:bg-[rgba(148,163,184,0.2)] text-[#F1F5F9] font-bold rounded-xl transition-colors border border-[rgba(148,163,184,0.1)]"
              >
                Go Home
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 text-left bg-black/40 p-4 rounded-xl overflow-auto text-xs text-[#EF4444] font-mono border border-[rgba(239,68,68,0.2)]">
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
