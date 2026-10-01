import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div role="alert" className="card-flat flex flex-col items-center justify-center p-12 text-center h-full border-red-500/20">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
        <AlertTriangle size={32} />
      </div>
      <h3 className="text-xl font-bold text-red-400 mb-2">{title}</h3>
      <p className="text-[var(--text-secondary)] max-w-sm mb-8">{message}</p>
      
      {onRetry && (
        <button onClick={onRetry} className="btn btn-glass flex items-center gap-2">
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
}
