"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EVENT_TYPES = [
  "Tree Plantation",
  "Clean-up Drive",
  "Blood Donation",
  "Food Distribution",
  "Education Support",
  "Other",
];

const fieldClass =
  "w-full rounded-full border border-[#D6D3C9] bg-white px-4 py-3 text-sm text-[#292524] outline-none placeholder:text-[#647067]/70 focus:border-[#14532D] focus:ring-2 focus:ring-[#D9F99D]";

const labelClass = "mb-2 block text-sm font-semibold text-[#292524]";

export default function CreateEventPage() {
  const router = useRouter();
  const [dateError, setDateError] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError("");

  const data = Object.fromEntries(new FormData(e.currentTarget));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(`${data.date}T00:00:00`) <= today) {
    setDateError(true);
    return;
  }

  setSubmitting(true);
  try {
    const res = await fetch("http://localhost:5000/create-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, createdAt: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error();

    router.push("/upcoming-events");
    router.refresh();
  } catch {
    setError("Could not create the event. Check that the backend is running and try again.");
    setSubmitting(false);
  }
}
  return (
    <main className="min-h-screen bg-[#F8F7F0] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="font-serif text-3xl font-bold text-[#14532D] sm:text-4xl md:text-5xl">
          Create Event
        </h1>
        <p className="mt-2 text-sm text-[#647067]">
          Share a community-service event for neighbors to join.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5 rounded-3xl border border-[#E3E1D6] bg-white p-5 sm:p-7"
        >
          <div>
            <label htmlFor="title" className={labelClass}>Event title</label>
            <input
              id="title"
              name="title"
              required
              placeholder="[Event title]"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              placeholder="[What will volunteers do?]"
              className={`${fieldClass} rounded-2xl`}
            />
          </div>

          <div>
            <label htmlFor="type" className={labelClass}>Event type</label>
            <select id="type" name="type" className={fieldClass}>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="image" className={labelClass}>Image URL</label>
            <input
              id="image"
              name="image"
              type="url"
              placeholder="https://"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="location" className={labelClass}>Location</label>
            <input
              id="location"
              name="location"
              required
              placeholder="[Location, City]"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="date" className={labelClass}>
              Event date (must be in the future)
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              onChange={() => setDateError(false)}
              className={fieldClass}
            />
            {dateError && (
              <p className="mt-2 text-xs text-red-700">Pick a date after today</p>
            )}
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#14532D] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#14532D]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9F99D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </main>
  );
}