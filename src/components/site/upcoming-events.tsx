import Link from "next/link";
import { EventCard } from "@/components/site/event-card";
import type { IEventItem } from "@/app/types/Events";

export async function UpcomingEvents() {
  let events: IEventItem[] = [];
  let apiError = false;
  try {
    // fetch data manually here
    const res = await fetch("http://localhost:5000/events");
    if (!res.ok) throw new Error(`Event API responded with ${res.status}`);
    events = (await res.json()) as IEventItem[];
  } catch {
    apiError = true;
  }

  return (
    <section className="border-t border-border/40 bg-[#F8F7F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#14532D] sm:text-4xl lg:text-5xl">
            Upcoming Events
          </h2>
          <p className="mt-4 text-base text-[#647067]">
            The latest events looking for volunteers.
          </p>
        </div>

        {apiError ? (
          <div className="mt-12 rounded-xl border border-border/60 bg-white p-10 text-center md:mt-16">
            <h3 className="text-2xl font-extrabold text-[#14532D]">
              Couldn&apos;t load events
            </h3>
            <p className="mt-2 text-sm text-[#647067]">
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
          <p className="mt-12 rounded-xl border border-border/60 bg-white p-8 text-center text-sm text-[#647067] md:mt-16">
            No upcoming events yet. Check back soon!
          </p>
        ) : (
          <>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3 xl:grid-cols-4">
              {events.slice(0, 6).map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* view all events */}
            <div className="mt-12 flex justify-center md:mt-16">
              <Link
                href="/upcoming-events"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-[#14532D]/40 bg-white px-6 text-sm font-semibold text-[#14532D] transition-colors hover:bg-[#14532D]/5"
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
