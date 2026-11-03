
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import EventActions from "./event-actions";

type EventItem = {
  _id: string;
  title: string;
  description?: string;
  category?: string | null;
  image?: string | null;
  location?: string;
  date: string;
};

function formatDate(value: string) {
  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ManageEventsPage() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  const userId = session?.user?.id;

  let events: EventItem[] = [];
  let apiError = false;

  if (userId) {
    try {
      const { token } = await auth.api.getToken({
        headers: requestHeaders,
      });

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/my-events`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }

      events = await res.json();
    } catch (error) {
      console.error("Failed to load events:", error);
      apiError = true;
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 md:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="font-serif text-4xl font-bold text-foreground">
          Manage Events
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Edit or remove events you created.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          {!userId ? (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-muted-foreground">
                Please log in to manage your events.
              </p>

              <Link
                href="/sign-in"
                className="mt-4 inline-flex h-10 items-center rounded-lg bg-[#14532D] px-5 text-sm font-medium text-white hover:bg-[#14532D]/90"
              >
                Log in
              </Link>
            </div>
          ) : apiError ? (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">
                Could not load your events. Please try again later.
              </p>
            </div>
          ) : events.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-muted-foreground">
                You haven&apos;t created any events yet.
              </p>

              <Link
                href="/create-event"
                className="mt-4 inline-flex h-10 items-center rounded-lg bg-[#14532D] px-5 text-sm font-medium text-white hover:bg-[#14532D]/90"
              >
                Create your first event
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-muted text-xs font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border text-foreground">
                  {events.map((event) => (
                    <tr
                      key={event._id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      <td className="px-6 py-4 font-medium">
                        {event.title}
                      </td>

                      <td className="px-6 py-4">
                        {event.category || "-"}
                      </td>

                      <td className="px-6 py-4">
                        {formatDate(event.date)}
                      </td>

                      <td className="px-6 py-4">
                        <EventActions event={event} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
