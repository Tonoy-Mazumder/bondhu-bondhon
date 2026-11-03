
import Link from "next/link";
import Image from "next/image";

const API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type EventItem = {
    _id: string;
    title: string;
    description?: string;
    category?: string;
    image?: string;
    location?: string;
    date: string;
    capacity?: number;
    joinedCount?: number;
};

const CATEGORY_MAP: Record<
    string,
    { title: string; category: string }
> = {
    "tree-plantation": {
        title: "Tree Plantation",
        category: "Environment",
    },
    "cleanup-campaigns": {
        title: "Cleanup Campaigns",
        category: "Environment",
    },
    donations: {
        title: "Donations",
        category: "Donation",
    },
    "winter-clothes": {
        title: "Winter Clothes",
        category: "Donation",
    },
    "food-donation": {
        title: "Food Donation",
        category: "Community Service",
    },
    "community-support": {
        title: "Community Support",
        category: "Community Service",
    },
    "animal-welfare": {
        title: "Animal Welfare",
        category: "Animal Welfare",
    },
};

function getTodayDate() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const selectedCategory = CATEGORY_MAP[slug];

    if (!selectedCategory) {
        return (
            <main className="min-h-screen bg-background px-4 py-20 text-center">
                <h1 className="text-3xl font-bold text-foreground">
                    Category Not Found
                </h1>
                <Link
                    href="/"
                    className="mt-5 inline-block text-[#14532D] underline dark:text-green-400"
                >
                    Back to Home
                </Link>
            </main>
        );
    }

    let events: EventItem[] = [];
    let apiError = false;

    try {
        const res = await fetch(`${API}/events`, {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch events");
        }

        const allEvents: EventItem[] = await res.json();

        const today = getTodayDate();

        events = allEvents
            .filter(
                (event) =>
                    event.category === selectedCategory.category &&
                    event.date > today
            )
            .sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
        console.error("Category events error:", error);
        apiError = true;
    }

    return (
        <main className="min-h-screen bg-background px-4 py-10 sm:px-6 md:py-16">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <Link
                        href="/"
                        className="text-sm font-medium text-[#14532D] hover:underline dark:text-green-400"
                    >
                        ← Back to Home
                    </Link>

                    <h1 className="mt-5 text-3xl font-extrabold text-foreground sm:text-4xl">
                        {selectedCategory.title}
                    </h1>

                    <p className="mt-3 text-muted-foreground">
                        Explore upcoming events and make a difference in your community.
                    </p>
                </div>

                {apiError ? (
                    <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
                        <p className="text-muted-foreground">
                            Could not load events. Please try again later.
                        </p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="rounded-xl border border-border bg-card px-6 py-14 text-center">
                        <h2 className="text-xl font-bold text-foreground">
                            No upcoming events
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            There are no events available in this category right now.
                        </p>

                        <Link
                            href="/upcoming-events"
                            className="mt-5 inline-flex rounded-lg bg-[#14532D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#166534]"
                        >
                            Explore all events
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <article
                                key={event._id}
                                className="overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
                            >
                                {event.image ? (
                                    <div className="relative h-52 w-full">
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-52 items-center justify-center bg-muted text-muted-foreground">
                                        No image available
                                    </div>
                                )}

                                <div className="p-5">
                                    <span className="text-xs font-semibold text-[#14532D] dark:text-green-400">
                                        {event.category}
                                    </span>

                                    <h2 className="mt-2 text-xl font-bold text-foreground">
                                        {event.title}
                                    </h2>

                                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                        {event.description || "No description available."}
                                    </p>

                                    <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                                        <p>📍 {event.location || "Location not specified"}</p>
                                        <p>📅 {formatDate(event.date)}</p>
                                        <p>
                                            👥 {event.joinedCount ?? 0} / {event.capacity ?? "N/A"}{" "}
                                            participants
                                        </p>
                                    </div>

                                    <Link
                                        href={`/events/${event._id}`}
                                        className="mt-5 block rounded-lg bg-[#14532D] py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#166534]"
                                    >
                                        View Event
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
