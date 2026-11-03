
"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "@/components/ui/toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const EVENT_TYPES = [
  "Tree Plantation",
  "Clean-up Drive",
  "Blood Donation",
  "Food Distribution",
  "Education Support",
  "Other",
];

const fieldClass =
  "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/10";

const labelClass = "mb-2 block text-sm font-semibold text-foreground";

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function CreateEventPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [minDate] = useState(getTomorrowDate);
  const [dateError, setDateError] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setDateError(false);

    if (!session?.user) {
      setError("Please login before creating an event.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const selectedDate = String(data.date || "");

    if (!selectedDate || selectedDate < minDate) {
      setDateError(true);
      setError("Please select a future date for your event.");
      return;
    }

    const capacity = Number(data.capacity);

    if (
      !Number.isInteger(capacity) ||
      capacity < 1 ||
      capacity > 10000
    ) {
      setError("Capacity must be between 1 and 10000.");
      return;
    }

    const eventData = {
      title: data.title,
      description: data.description,
      category: data.category,
      image: data.image,
      location: data.location,
      date: selectedDate,
      capacity,
      joinedCount: 0,
      participants: [],
      organizerId: session.user.id,
      organizerName: session.user.name,
      createdAt: new Date().toISOString(),
    };

    try {
      setSubmitting(true);

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication token পাওয়া যায়নি।");
      }

      const res = await fetch(`${API}/create-events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify(eventData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create event.");
      }

      toast.add({
        title: "Event created successfully!",
        type: "success",
      });

      router.push("/upcoming-events");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <span className="mb-3 inline-block rounded-full bg-[#D9F99D] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#14532D]">
            Make a Difference
          </span>

          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            Create an Event
          </h1>

          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Bring people together and make your community better.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className={labelClass}>
                Event Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter your event title"
                required
                minLength={3}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Description
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe your event..."
                required
                rows={5}
                minLength={10}
                className={`${fieldClass} resize-y`}
              />
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                Event Category
              </label>

              <select
                id="category"
                name="category"
                required
                defaultValue=""
                className={fieldClass}
              >
                <option value="" disabled>
                  Select a category
                </option>

                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="image" className={labelClass}>
                Event Image URL
              </label>

              <input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                required
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="location" className={labelClass}>
                Event Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="Enter event location"
                required
                className={fieldClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="date" className={labelClass}>
                  Event Date
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  min={minDate}
                  onChange={() => {
                    setDateError(false);
                    setError("");
                  }}
                  className={`${fieldClass} ${
                    dateError ? "border-red-500" : ""
                  }`}
                />

                {dateError && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                    Please select a future date.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="capacity" className={labelClass}>
                  Maximum Participants
                </label>

                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  placeholder="e.g. 100"
                  min="1"
                  max="10000"
                  required
                  className={fieldClass}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !session?.user}
              className="w-full rounded-lg bg-[#14532D] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#166534] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating Event..." : "Create Event"}
            </button>

            {!session?.user && (
              <p className="text-center text-sm text-red-600 dark:text-red-400">
                Please sign in to create an event.
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
