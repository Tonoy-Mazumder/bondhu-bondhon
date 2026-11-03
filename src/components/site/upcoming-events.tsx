
import Link from "next/link";
import { EventCard } from "@/components/site/event-card";
import type { IEventItem } from "@/app/types/Events";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function UpcomingEvents() {
  let events: IEventItem[] = [];
  let apiError = false;

  try {
    const res = await fetch(`${API}/events`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Event API responded with ${res.status}`);
    }

    events = (await res.json()) as IEventItem[];
  } catch (error) {
    console.error("Failed to fetch upcoming events:", error);
    apiError = true;
  }

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:py-24">

        {/* Section heading */}
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Upcoming Events
          </h2>

          <p className="mt-4 text-base text-muted-foreground">
            The latest events looking for volunteers.
          </p>
        </div>

        {/* API Error */}
        {apiError ? (
          <div className="mt-12 rounded-xl border border-border bg-card p-10 text-center md:mt-16">
            <h3 className="text-2xl font-extrabold text-foreground">
              Couldn&apos;t load events
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Check your connection and try again.
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-[#14532D] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#14532D]/90"
            >
              Retry
            </Link>
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <p className="mt-12 rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground md:mt-16">
            No upcoming events yet. Check back soon!
          </p>
        ) : (
          <>
            {/* Event Cards */}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 xl:grid-cols-4">
              {events.slice(0, 6).map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                />
              ))}
            </div>

            {/* View All Events */}
            <div className="mt-12 flex justify-center md:mt-16">
              <Link
                href="/upcoming-events"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-[#14532D]/40 bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                View All Events
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
