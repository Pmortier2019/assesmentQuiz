export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Pulsing logo mark */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] animate-pulse" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] opacity-40 scale-110 animate-ping" />
          <svg
            className="absolute inset-0 w-full h-full p-3 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        {/* Skeleton lines */}
        <div className="flex flex-col items-center gap-2">
          <div className="skeleton w-32 h-2.5 rounded-full" />
          <div className="skeleton w-20 h-2 rounded-full" />
        </div>
        <p className="text-xs text-[#94a3b8] font-medium">{label}</p>
      </div>
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] animate-pulse" />
        <div className="skeleton w-24 h-2 rounded-full" />
      </div>
    </div>
  );
}
