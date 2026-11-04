
import { EventsBrowser } from "./_components/events-browser";
import Link from "next/link";
import type { IEventItem } from "@/app/types/Events";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Upcoming Events",
  description:
    "The latest community-service events looking for volunteers.",
};

export default async function UpcomingEventsPage() {
  let events: IEventItem[] = [];
  let apiError = false;

  try {
    const res = await fetch(`${API}/events`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Event API responded with ${res.status}`);
    }

    events = await res.json();
    console.log(events);
  } catch (error) {
    console.error("Event fetching error:", error);
    apiError = true;
  }

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:py-24">
        <div className="max-w-xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Upcoming Events
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Find a community event near you and sign up to help. Only future
            events are shown.
          </p>
        </div>

        {apiError ? (
          <div className="mt-10 rounded-xl border border-border bg-card p-10 text-center">
            <h3 className="text-2xl font-extrabold text-foreground">
              Couldn&apos;t load events
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Check your connection and try again.
            </p>

            <Link
              href="/upcoming-events"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-[#14532D] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#14532D]/90"
            >
              Retry
            </Link>
          </div>
        ) : (
          <EventsBrowser events={events} />
        )}
      </div>
    </section>
  );
}
