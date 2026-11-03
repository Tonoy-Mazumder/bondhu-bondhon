
"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/site/event-card";
import type { IEventItem } from "@/app/types/Events";

const SORT_OPTIONS = {
  soonest: "Date: soonest first",
  latest: "Date: latest first",
} as const;

type SortOption = keyof typeof SORT_OPTIONS;

export function EventsBrowser({
  events,
}: {
  events: IEventItem[];
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("soonest");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [
      ...new Set(
        events
          .map((event) => event.category)
          .filter((item): item is string => Boolean(item))
      ),
    ],
    [events]
  );

  const startOfToday = new Date(
    new Date().toDateString()
  ).getTime();

  const visibleEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = events.filter((event) => {
      const eventDate = new Date(event.date).getTime();

      if (Number.isNaN(eventDate) || eventDate < startOfToday) {
        return false;
      }

      if (category && event.category !== category) {
        return false;
      }

      if (query) {
        const haystack =
          `${event.title} ${event.location}`.toLowerCase();

        if (!haystack.includes(query)) return false;
      }

      return true;
    });

    return filtered.sort((a, b) => {
      const diff =
        new Date(a.date).getTime() -
        new Date(b.date).getTime();

      return sort === "soonest" ? diff : -diff;
    });
  }, [events, search, sort, category, startOfToday]);

  const pillClass = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-[#14532D] text-white"
        : "border border-border bg-white text-[#292524] hover:border-[#14532D]/40"
    }`;

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or location"
          aria-label="Search events by title or location"
          className="h-12 flex-1 rounded-xl border border-border bg-white px-4 text-sm text-[#292524] placeholder:text-[#647067] focus:outline-2 focus:outline-offset-2 focus:outline-[#14532D]/50"
        />

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value as SortOption)
          }
          aria-label="Sort events by date"
          className="h-12 rounded-xl border border-border bg-white px-4 text-sm text-[#292524] sm:w-52"
        >
          {Object.entries(SORT_OPTIONS).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
          className={pillClass(category === null)}
        >
          All
        </button>

        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() =>
              setCategory((current) =>
                current === item ? null : item
              )
            }
            aria-pressed={category === item}
            className={pillClass(category === item)}
          >
            {item}
          </button>
        ))}
      </div>

      {visibleEvents.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border/60 bg-white p-10 text-center">
          <h3 className="text-2xl font-extrabold text-[#14532D]">
            No events found
          </h3>

          <p className="mt-2 text-sm text-[#647067]">
            Try a different search or filter.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSort("soonest");
              setCategory(null);
            }}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-lg border border-[#14532D]/40 bg-white px-6 text-sm font-semibold text-[#14532D]"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleEvents.map((event) => (
            <EventCard
              key={
                event._id ||
                `${event.title}-${event.date}-${event.location}`
              }
              event={event}
            />
          ))}
        </div>
      )}
    </>
  );
}
