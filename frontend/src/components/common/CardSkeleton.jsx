export default function CardSkeleton() {
  return (
    <div aria-busy="true" className="card-flat animate-pulse p-6 h-full flex flex-col gap-4">
      <div className="h-6 w-3/4 bg-[var(--glass-border)] rounded-md"></div>
      <div className="flex-1 space-y-2 mt-4">
        <div className="h-4 w-full bg-[var(--glass-border)]/50 rounded-md"></div>
        <div className="h-4 w-5/6 bg-[var(--glass-border)]/50 rounded-md"></div>
        <div className="h-4 w-4/6 bg-[var(--glass-border)]/50 rounded-md"></div>
      </div>
      <div className="h-10 w-28 bg-[var(--glass-border)] rounded-md mt-auto"></div>
    </div>
  );
}
