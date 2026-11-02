import { EventsBrowser } from "./_components/events-browser";
import Link from "next/link";
import type { IEventItem } from "@/app/types/Events";

// fetch data manually here
let events: IEventItem[] = [];
let apiError = false;
try {
  const res = await fetch("http://localhost:5000/events", { cache: "no-store" });
  if (!res.ok) throw new Error(`Event API responded with ${res.status}`);
  events = (await res.json()) as IEventItem[];
} catch {
  apiError = true;
}

export default function UpcomingEventsPage() {
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

        {apiError ? (
          <div className="mt-10 rounded-xl border border-border/60 bg-white p-10 text-center">
            <h3 className="text-2xl font-extrabold text-[#14532D]">
              Couldn&apos;t load events
            </h3>
            <p className="mt-2 text-sm text-[#647067]">
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

export const metadata = {
  title: "Upcoming Events",
  description: "The latest community-service events looking for volunteers.",
};
