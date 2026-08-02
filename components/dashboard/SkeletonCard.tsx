export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-base animate-pulse">
      {/* Thumbnail placeholder */}
      <div className="h-40 bg-surface-brand" />

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 w-3/4 rounded-md bg-surface-brand" />
        <div className="h-3 w-1/2 rounded-md bg-surface-brand" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-5 w-16 rounded-full bg-surface-brand" />
          <div className="h-7 w-7 rounded-md bg-surface-brand" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
