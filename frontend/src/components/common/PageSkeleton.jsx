export default function PageSkeleton() {
  return (
    <div aria-busy="true" className="animate-pulse flex flex-col gap-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-10 w-48 bg-[var(--glass-border)] rounded-lg"></div>
        <div className="h-4 w-72 bg-[var(--glass-border)]/50 rounded-lg"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <div className="card-flat h-48 bg-[var(--glass-bg)] border-[var(--glass-border)]"></div>
        <div className="card-flat h-48 bg-[var(--glass-bg)] border-[var(--glass-border)]"></div>
        <div className="card-flat h-48 bg-[var(--glass-bg)] border-[var(--glass-border)]"></div>
        <div className="card-flat h-48 bg-[var(--glass-bg)] border-[var(--glass-border)]"></div>
        <div className="card-flat h-48 bg-[var(--glass-bg)] border-[var(--glass-border)] md:col-span-2 lg:col-span-2"></div>
      </div>
    </div>
  );
}
