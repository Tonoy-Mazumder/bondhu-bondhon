import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import EventActions from "./event-actions";


const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type EventItem = {
  _id: string;
  title: string;
  description?: string;
  type?: string | null;
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
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  let events: EventItem[] = [];
  if (userId) {
    const res = await fetch(`${API}/my-events?userId=${userId}`, {
      cache: "no-store",
    });
    events = await res.json();
  }

  return (
    <main className="min-h-screen bg-[#F8F7F0] px-4 py-8 sm:px-6 md:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="font-serif text-4xl font-bold text-[#14532D]">
          Manage Events
        </h1>
        <p className="mt-2 text-sm text-[#647067]">
          Edit or remove events you created.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#E3E1D6] bg-white">
          {!userId ? (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-[#647067]">
                Please log in to manage your events.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-flex h-10 items-center rounded-lg bg-[#14532D] px-5 text-sm font-medium text-white hover:bg-[#14532D]/90"
              >
                Log in
              </Link>
            </div>
          ) : events.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-[#647067]">
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
                <thead className="bg-[#EFEEE4] text-xs font-semibold text-[#647067]">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E1D6] text-[#292524]">
                  {events.map((event) => (
                    <tr key={event._id}>
                      <td className="px-6 py-4 font-medium">{event.title}</td>
                      <td className="px-6 py-4">{event.type || "-"}</td>
                      <td className="px-6 py-4">{formatDate(event.date)}</td>
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