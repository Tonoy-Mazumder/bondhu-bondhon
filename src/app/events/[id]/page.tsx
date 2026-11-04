
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Clock,
} from "lucide-react";
import { JoinEventButton } from "./_components/join-event-button";
import type { IEventItem } from "@/app/types/Events";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type EventDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const API = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

async function loadEvent(id: string): Promise<IEventItem | null> {
  try {
    const res = await fetch(`${API}/events/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const event = (await res.json()) as IEventItem;

    if (!event?._id) return null;

    return event;
  } catch (error) {
    console.error("Failed to load event:", error);
    return null;
  }
}

// Format date without timezone conversion
function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) return dateString;

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Format time directly from HH:mm
function formatTime(timeString?: string) {
  if (!timeString) return "Time not specified";

  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(timeString);

  if (!match) return timeString;

  const hour = Number(match[1]);
  const minute = match[2];

  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minute} ${period}`;
}

export async function generateMetadata({
  params,
}: EventDetailsPageProps) {
  const { id } = await params;
  const event = await loadEvent(id);

  if (!event) return { title: "Event not found" };

  return {
    title: event.title,
    description: event.description,
  };
}

const EventDetailsPage = async ({
  params,
}: EventDetailsPageProps) => {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  const { id } = await params;
  const event = await loadEvent(id);

  if (!event) notFound();

  return (
    <section className="min-h-full bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <Link
          href="/upcoming-events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#14532D] transition-colors hover:text-[#14532D]/80 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to events
        </Link>

        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          {event.image ? (
            <div className="relative h-64 w-full sm:h-80 lg:h-[420px]">
              <Image
                src={event.image}
                alt={event.title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1280px) 1200px, 100vw"
              />
            </div>
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-muted px-4 text-center text-sm text-muted-foreground sm:h-80 lg:h-[420px]">
              Event cover photo
            </div>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="w-fit rounded-full bg-[#D9F99D] px-3 py-1 text-xs font-semibold text-[#14532D]">
              {event.category}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {event.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                {event.location}
              </span>

              <span className="flex items-center gap-2">
                <CalendarDays className="size-4 shrink-0" />
                {formatDate(event.date)}
              </span>

              <span className="flex items-center gap-2">
                <Clock className="size-4 shrink-0" />
                {formatTime(event.startTime)}
              </span>
            </div>

            <h2 className="mt-8 text-2xl font-extrabold text-foreground">
              About this event
            </h2>

            <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground/85">
              {event.description}
            </p>
          </div>

          <aside>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-8">
              <div className="flex items-center gap-3">
                {event.organizerImage ? (
                  <Image
                    src={event.organizerImage}
                    alt={event.organizerName || "Organizer"}
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-bold text-foreground"
                  >
                    {event.organizerName?.charAt(0).toUpperCase() || "O"}
                  </span>
                )}

                <div>
                  <p className="font-semibold text-foreground">
                    {event.organizerName || "Unknown Organizer"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Organizer
                  </p>
                </div>
              </div>

              <JoinEventButton
                eventId={String(event._id)}
                title={event.title}
                joinedCount={event.joinedCount ?? 0}
                initialJoined={
                  event.participants?.includes(session?.user?.id ?? "") ?? false
                }
                capacity={event.capacity ?? 0}
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default EventDetailsPage;
