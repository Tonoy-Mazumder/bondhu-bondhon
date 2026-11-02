"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const EVENT_TYPES = [
  "Tree Plantation",
  "Clean-up Drive",
  "Blood Donation",
  "Food Distribution",
  "Education Support",
  "Other",
];

const fieldClass =
  "w-full rounded-xl border border-[#D6D3C9] bg-white px-4 py-3 text-sm text-[#292524] outline-none placeholder:text-[#647067]/70 focus:border-[#14532D] focus:ring-2 focus:ring-[#D9F99D]";

const labelClass = "mb-2 block text-sm font-semibold text-[#292524]";

type EventItem = {
  _id: string;
  title: string;
  description?: string;
  type?: string | null;
  image?: string | null;
  location?: string;
  date: string;
};

export default function EventActions({ event }: { event: EventItem }) {
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setEditError("");

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      await fetch(`${API}/events/${event._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setEditOpen(false);
      router.refresh(); // server page fetches the list again
    } catch {
      setEditError("Failed to update event.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError("");

    try {
      await fetch(`${API}/events/${event._id}`, { method: "DELETE" });
      setDeleteOpen(false);
      router.refresh();
    } catch {
      setDeleteError("Failed to delete event.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="inline-flex h-10 items-center rounded-lg border border-[#D6D3C9] bg-white px-4 text-xs font-semibold text-[#14532D] transition-colors hover:bg-[#F8F7F0]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="inline-flex h-10 items-center rounded-lg border border-[#D6D3C9] bg-white px-4 text-xs font-semibold text-[#B42318] transition-colors hover:bg-red-50"
        >
          Delete
        </button>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={(o) => !saving && setEditOpen(o)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#14532D]">
              Edit event
            </DialogTitle>
            <DialogDescription>Update the details of your event.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label htmlFor={`title-${event._id}`} className={labelClass}>
                Event title
              </label>
              <input
                id={`title-${event._id}`}
                name="title"
                required
                defaultValue={event.title}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor={`description-${event._id}`} className={labelClass}>
                Description
              </label>
              <textarea
                id={`description-${event._id}`}
                name="description"
                required
                rows={4}
                defaultValue={event.description}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor={`type-${event._id}`} className={labelClass}>
                Event type
              </label>
              <select
                id={`type-${event._id}`}
                name="type"
                defaultValue={event.type ?? EVENT_TYPES[0]}
                className={fieldClass}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`image-${event._id}`} className={labelClass}>
                Image URL
              </label>
              <input
                id={`image-${event._id}`}
                name="image"
                type="url"
                placeholder="https://"
                defaultValue={event.image ?? ""}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor={`location-${event._id}`} className={labelClass}>
                Location
              </label>
              <input
                id={`location-${event._id}`}
                name="location"
                required
                defaultValue={event.location}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor={`date-${event._id}`} className={labelClass}>
                Event date
              </label>
              <input
                id={`date-${event._id}`}
                name="date"
                type="date"
                required
                defaultValue={event.date?.slice(0, 10)}
                className={fieldClass}
              />
            </div>

            {editError && (
              <p role="alert" className="text-sm text-red-700">
                {editError}
              </p>
            )}

            <DialogFooter className="sm:justify-start">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={saving}
                className="h-11 rounded-xl border-[#14532D] px-6 font-semibold text-[#14532D] hover:bg-[#14532D]/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="h-11 rounded-xl bg-[#14532D] px-6 font-semibold text-white hover:bg-[#14532D]/90"
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={(o) => !deleting && setDeleteOpen(o)}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#14532D]">
              Delete this event?
            </DialogTitle>
            <DialogDescription>
              This can&apos;t be undone. People who joined will no longer see it.
            </DialogDescription>
          </DialogHeader>

          <p className="truncate text-sm font-medium text-[#292524]">
            {event.title}
          </p>

          {deleteError && (
            <p role="alert" className="text-sm text-red-700">
              {deleteError}
            </p>
          )}

          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
              className="h-11 rounded-xl border-[#14532D] px-6 font-semibold text-[#14532D] hover:bg-[#14532D]/5"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="h-11 rounded-xl bg-[#B42318] px-6 font-semibold text-white hover:bg-[#B42318]/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}