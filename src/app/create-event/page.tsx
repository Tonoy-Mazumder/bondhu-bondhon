"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const API = process.env.NEXT_PUBLIC_API_URL;

const EVENT_TYPES = [
  "Tree Plantation",
  "Clean-up Drive",
  "Blood Donation",
  "Food Distribution",
  "Education Support",
  "Other",
];

const fieldClass =
  "w-full rounded-lg border border-[#d6dfd5] bg-white px-4 py-3 text-sm text-[#292524] outline-none transition focus:border-[#14532D] focus:ring-2 focus:ring-[#14532D]/10";

const labelClass =
  "mb-2 block text-sm font-semibold text-[#292524]";

export default function CreateEventPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [dateError, setDateError] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setDateError(false);

    if (!session?.user) {
      setError("Please login before creating an event.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(`${data.date}T00:00:00`);

    if (
      !data.date ||
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate <= today
    ) {
      setDateError(true);
      setError("Please select a future date for your event.");
      return;
    }

    // Capacity validation
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
      date: data.date,
      capacity,
      joinedCount: 0,
      participants: [],
      organizerId: session.user.id,
      organizerName: session.user.name,
      createdAt: new Date().toISOString(),
    };

    try {
      setSubmitting(true);

      const res = await fetch(`${API}/create-events`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message || "Failed to create event."
        );
      }

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[#647067]">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7F0] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <span className="mb-3 inline-block rounded-full bg-[#D9F99D] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#14532D]">
            Make a Difference
          </span>

          <h1 className="text-3xl font-bold text-[#14532D] md:text-4xl">
            Create an Event
          </h1>

          <p className="mt-3 text-sm text-[#647067] md:text-base">
            Bring people together and make your community better.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-[#e4e8df] bg-white p-5 shadow-sm md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
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

            {/* Description */}
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

            {/* Category */}
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

            {/* Image URL */}
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

            {/* Location */}
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

            {/* Date and Capacity */}
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
                  onChange={() => setDateError(false)}
                  className={`${fieldClass} ${dateError ? "border-red-500" : ""
                    }`}
                />

                {dateError && (
                  <p className="mt-2 text-xs text-red-600">
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

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !session?.user}
              className="w-full rounded-lg bg-[#14532D] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#166534] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating Event..." : "Create Event"}
            </button>

            {!session?.user && (
              <p className="text-center text-sm text-red-600">
                Please sign in to create an event.
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}