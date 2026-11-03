
import Image from "next/image";
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
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {event.image ? (
        <div className="relative h-48 w-full shrink-0 overflow-hidden border-b border-border">
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(min-width: 1280px) 290px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex h-48 w-full shrink-0 items-center justify-center border-b border-border bg-muted px-4 text-center text-sm text-muted-foreground">
          Event cover photo
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <span className="w-fit rounded-full bg-[#D9F99D] px-3 py-1 text-xs font-bold text-[#14532D]">
          {event.category}
        </span>

        <h3 className="mt-4 line-clamp-2 min-h-14 text-xl font-extrabold leading-snug text-foreground">
          {event.title}
        </h3>

        <div className="mt-4 space-y-3">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin
              className="size-4 shrink-0 text-[#14532D] dark:text-green-400"
              aria-hidden="true"
            />
            <span className="line-clamp-1">
              {event.location}
            </span>
          </p>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays
              className="size-4 shrink-0 text-[#14532D] dark:text-green-400"
              aria-hidden="true"
            />
            {formatDate(event.date)}
          </p>
        </div>

        <div className="mt-auto pt-8">
          <Link
            href={`/events/${event._id}`}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#14532D] text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#166534] hover:shadow-md"
          >
            View Event
          </Link>
        </div>
      </div>
    </article>
  );
}
