import { EventCardSkeleton } from "@/components/site/event-card-skeleton";

export default function Loading() {
  return (
    <section className="border-t border-border/40 bg-[#F8F7F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:py-24">
        <div className="max-w-xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#14532D] sm:text-4xl lg:text-5xl">
            Upcoming Events
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#647067]">
            Find a community event near you and sign up to help. Only future
            events are shown.
          </p>
        </div>

        <div
          role="status"
          aria-label="Loading events"
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
