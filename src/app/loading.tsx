import { EventCardSkeleton } from "@/components/site/event-card-skeleton";

export default function Loading() {
  return (
    <section className="border-t border-border/40 bg-[#F8F7F0]" aria-hidden>
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:py-24">
        <div className="mx-auto max-w-xl">
          <div className="mx-auto h-9 w-64 animate-pulse rounded bg-[#DCE8DC] sm:h-10 lg:h-12" />
          <div className="mx-auto mt-4 h-4 w-72 animate-pulse rounded bg-[#DCE8DC]" />
        </div>

        <div role="status" className="sr-only">
          Loading events
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
