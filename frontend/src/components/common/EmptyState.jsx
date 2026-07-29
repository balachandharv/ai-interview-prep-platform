import { Link } from 'react-router-dom';

export default function EmptyState({ icon, title, description, actionText, actionLink }) {
  return (
    <div className="card-flat flex flex-col items-center justify-center p-12 text-center h-full">
      <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mb-6 text-[#6366F1]">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#0F172A] mb-2">{title}</h3>
      <p className="text-[#475569] max-w-sm mb-8">{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary no-underline">
          {actionText}
        </Link>
      )}
    </div>
  );
}
