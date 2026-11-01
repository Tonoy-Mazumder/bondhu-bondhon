/** Skeleton placeholder shaped like EventCard, used in route loading states. */
export function EventCardSkeleton() {
  return (
    <article
      aria-hidden
      className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm"
    >
      <div className="h-44 w-full animate-pulse border-b-2 border-dashed border-[#14532D]/30 bg-[#DCE8DC]" />

      <div className="flex flex-1 flex-col p-5">
        <div className="h-4 w-14 animate-pulse rounded-full bg-[#DCE8DC]" />
        <div className="mt-4 h-4 w-full animate-pulse rounded bg-[#DCE8DC]" />
        <div className="mt-2.5 h-3.5 w-2/3 animate-pulse rounded bg-[#DCE8DC]" />

        <div className="mt-5 h-11 w-full animate-pulse rounded-lg bg-[#DCE8DC]" />
      </div>
    </article>
  );
}
