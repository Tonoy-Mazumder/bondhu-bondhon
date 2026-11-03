
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { IEventItem } from "@/app/types/Events";

function formatDate(iso: string) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return iso;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function EventCard({ event }: { event: IEventItem }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {event.image ? (
        <div className="relative h-44 w-full border-b border-border">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-44 w-full items-center justify-center border-b border-border bg-muted px-4 text-center text-sm text-muted-foreground">
          Event cover photo
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <span className="w-fit rounded-full bg-[#D9F99D] px-3 py-1 text-xs font-semibold text-[#14532D]">
          {event.category}
        </span>

        <h3 className="mt-3 text-xl font-extrabold leading-snug text-foreground">
          {event.title}
        </h3>

        <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {event.location}
        </p>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
          {formatDate(event.date)}
        </p>

        <Link
          href={`/events/${event._id}`}
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#14532D] text-sm font-semibold text-white transition-colors hover:bg-[#14532D]/90"
        >
          View Event
        </Link>
      </div>
    </article>
  );
}
