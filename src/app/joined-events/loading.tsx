import { EventCardSkeleton } from "@/components/site/event-card-skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-foreground">Joined Events</h1>

        <p className="mb-7 mt-2 text-sm text-muted-foreground">
          Events youve signed up for, soonest first.
        </p>

        <div
          role="status"
          aria-label="Loading joined events"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
