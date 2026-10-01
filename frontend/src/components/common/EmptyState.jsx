import { Link } from 'react-router-dom';

export default function EmptyState({ icon, title, description, actionText, actionLink, onAction }) {
  return (
    <div className="card-flat flex flex-col items-center justify-center p-12 text-center h-full">
      <div className="w-16 h-16 rounded-2xl bg-[rgba(6,182,212,0.1)] flex items-center justify-center mb-6 text-[var(--aqua-400)] border border-[var(--aqua-400)]/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-[var(--text-secondary)] max-w-sm mb-8">{description}</p>
      
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary no-underline">
          {actionText}
        </Link>
      )}
      
      {actionText && onAction && !actionLink && (
        <button onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
}
