
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface IEvent {
  _id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  image?: string;
}

export default async function JoinedEventsPage() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) redirect("/sign-in");

  let events: IEvent[] = [];
  let apiError = false;

  try {
    // Generate JWT
    const { token } = await auth.api.getToken({
      headers: requestHeaders,
    });

    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Fetch joined events
    const res = await fetch(`${API}/joined-events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch joined events");
    }

    events = await res.json();

    // Sort events by date
    events.sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error) {
    console.error("Failed to fetch joined events:", error);
    apiError = true;
  }

  return (
    <main className="min-h-screen bg-[#F8F7F0] px-5 py-12 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-[#14532D]">
          Joined Events
        </h1>

        <p className="mt-2 mb-7 text-sm text-[#647067]">
          Events you've signed up for, soonest first.
        </p>

        {apiError ? (
          <div className="rounded-2xl border border-red-200 bg-white p-12 text-center">
            <h2 className="text-xl font-semibold text-red-600">
              Failed to load events
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Please try again later.
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center">
            <h2 className="text-xl font-semibold text-[#14532D]">
              No joined events yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Explore upcoming events and join a community activity.
            </p>

            <Link
              href="/upcoming-events"
              className="mt-5 inline-block rounded-lg bg-[#14532D] px-6 py-3 text-white"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="overflow-hidden rounded-2xl border border-[#E5E1D5] bg-white"
              >
                <div className="h-40 bg-[#DDE6DA]">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#647067]">
                      Event cover photo
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <span className="rounded-full bg-[#D9F99D] px-3 py-1 text-xs text-[#14532D]">
                    {event.category}
                  </span>

                  <h2 className="mt-3 text-xl font-bold text-[#14532D]">
                    {event.title}
                  </h2>

                  <p className="mt-5 text-sm text-[#647067]">
                    {event.location}
                  </p>

                  <p className="mt-2 text-sm text-[#647067]">
                    {new Date(`${event.date}T00:00:00`).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>

                  <Link
                    href={`/events/${event._id}`}
                    className="mt-3 block rounded-xl bg-[#14532D] py-3 text-center text-sm font-semibold text-white hover:bg-[#166534]"
                  >
                    View Event
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
