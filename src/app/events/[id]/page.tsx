import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { JoinEventButton } from "./_components/join-event-button";
import type { IEventItem } from "@/app/types/Events";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type EventDetailsPageProps = {
  params: Promise<{ id: string }>;
};

async function loadEvent(id: string): Promise<IEventItem | null> {
  try {
    // fetch data manually here
    const res = await fetch(`http://localhost:5000/events/${id}`);
    if (!res.ok) return null;
    const event = (await res.json()) as IEventItem;
    if (!event?._id) return null;
    return event;
  } catch {
    return null;
  }
}

function formatDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function generateMetadata({ params }: EventDetailsPageProps) {
  const { id } = await params;
  const event = await loadEvent(id);
  if (!event) return { title: "Event not found" };
  return { title: event.title, description: event.description };
}

const EventDetailsPage = async ({ params }: EventDetailsPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { id } = await params;
  const event = await loadEvent(id);
  if (!event) notFound();

  return (
    <section className="bg-[#F8F7F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <Link
          href="/upcoming-events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#14532D] transition-colors hover:text-[#14532D]/80"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to events
        </Link>

        {/* cover photo */}
        <div className="mt-6 overflow-hidden rounded-xl border-2 border-dashed border-[#14532D]/30">
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
            <div className="flex h-64 w-full items-center justify-center bg-[#DCE8DC] px-4 text-center text-sm text-[#14532D]/80 sm:h-80 lg:h-[420px]">
              Event cover photo
            </div>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="w-fit rounded-full bg-[#D9F99D] px-3 py-1 text-xs font-semibold text-[#14532D]">
              {event.category}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#14532D] sm:text-4xl lg:text-5xl">
              {event.title}
            </h1>

            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#647067]">
              <MapPin className="size-4 shrink-0" aria-hidden />
              {event.location}
              <span aria-hidden>·</span>
              <CalendarDays className="size-4 shrink-0" aria-hidden />
              {formatDateTime(event.date)}
            </p>

            <h2 className="mt-8 text-2xl font-extrabold text-[#14532D]">
              About this event
            </h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-[#292524]">
              {event.description}
            </p>
          </div>

          <aside>
            <div className="rounded-xl border border-border/60 bg-white p-6 shadow-sm lg:sticky lg:top-8">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#DCE8DC] text-lg font-bold text-[#14532D]"
                >
                  {event.organizer?.charAt(0).toUpperCase() || "O"}
                </span>
                <div>
                  <p className="font-semibold text-[#292524]">
                    {event.organizer}
                  </p>
                  <p className="text-sm text-[#647067]">Organizer</p>
                </div>
              </div>

              {/* join event — client button; toast + joined state handled inside */}
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
