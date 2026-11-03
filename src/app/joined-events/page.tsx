
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
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

    if (!session) redirect("/login");

    let events: IEvent[] = [];
    let apiError = false;

    try {
        const { token } = await auth.api.getToken({
            headers: requestHeaders,
        });

        if (!token) {
            throw new Error("Authentication token not found");
        }

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

        events.sort(
            (a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    } catch (error) {
        console.error("Failed to fetch joined events:", error);
        apiError = true;
    }

    return (
        <main className="min-h-screen bg-background px-5 py-12 text-foreground md:px-10 lg:px-16">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-4xl font-bold text-foreground">
                    Joined Events
                </h1>

                <p className="mb-7 mt-2 text-sm text-muted-foreground">
                    Events youve signed up for, soonest first.
                </p>

                {apiError ? (
                    <div className="rounded-2xl border border-red-200 bg-card p-12 text-center dark:border-red-900">
                        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
                            Failed to load events
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Please try again later.
                        </p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="rounded-2xl border border-border bg-card p-12 text-center">
                        <h2 className="text-xl font-semibold text-foreground">
                            No joined events yet
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Explore upcoming events and join a community activity.
                        </p>

                        <Link
                            href="/upcoming-events"
                            className="mt-5 inline-block rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Explore Events
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="overflow-hidden rounded-2xl border border-border bg-card"
                            >
                                <div className="relative h-40 bg-muted">
                                    {event.image ? (
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                            Event cover photo
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                                        {event.category}
                                    </span>

                                    <h2 className="mt-3 text-xl font-bold text-foreground">
                                        {event.title}
                                    </h2>

                                    <p className="mt-5 text-sm text-muted-foreground">
                                        {event.location}
                                    </p>

                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {new Date(
                                            `${event.date}T00:00:00`
                                        ).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>

                                    <Link
                                        href={`/events/${event._id}`}
                                        className="mt-3 block rounded-xl bg-[#14532D] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#166534]"
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
