
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

const API = "http://localhost:5000";

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
  category?: string | null;
  image?: string | null;
  location?: string;
  date: string;
  capacity?: number;
  joinedCount?: number;
};

export default function EventActions({
  event,
}: {
  event: EventItem;
}) {
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

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const capacity = Number(data.capacity);

    if (!Number.isInteger(capacity) || capacity < 1) {
      setEditError("Please enter a valid participant capacity.");
      setSaving(false);
      return;
    }

    if (
      event.joinedCount !== undefined &&
      capacity < event.joinedCount
    ) {
      setEditError(
        "Capacity cannot be less than the current number of participants."
      );
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`${API}/events/${event._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          capacity,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update event");
      }

      setEditOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      setEditError("Failed to update event. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch(`${API}/events/${event._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete event");
      }

      setDeleteOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      setDeleteError("Failed to delete event. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setEditError("");
            setEditOpen(true);
          }}
          className="inline-flex h-10 items-center rounded-lg border border-[#D6D3C9] bg-white px-4 text-xs font-semibold text-[#14532D] transition-colors hover:bg-[#F8F7F0]"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => {
            setDeleteError("");
            setDeleteOpen(true);
          }}
          className="inline-flex h-10 items-center rounded-lg border border-[#D6D3C9] bg-white px-4 text-xs font-semibold text-[#B42318] transition-colors hover:bg-red-50"
        >
          Delete
        </button>
      </div>

      {/* Edit dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(open) => !saving && setEditOpen(open)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#14532D]">
              Edit event
            </DialogTitle>

            <DialogDescription>
              Update the details of your event.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <label
                htmlFor={`title-${event._id}`}
                className={labelClass}
              >
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
              <label
                htmlFor={`description-${event._id}`}
                className={labelClass}
              >
                Description
              </label>

              <textarea
                id={`description-${event._id}`}
                name="description"
                required
                rows={4}
                defaultValue={event.description ?? ""}
                className={fieldClass}
              />
            </div>

            <div>
              <label
                htmlFor={`category-${event._id}`}
                className={labelClass}
              >
                Event category
              </label>

              <select
                id={`category-${event._id}`}
                name="category"
                defaultValue={event.category ?? EVENT_TYPES[0]}
                className={fieldClass}
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor={`image-${event._id}`}
                className={labelClass}
              >
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
              <label
                htmlFor={`location-${event._id}`}
                className={labelClass}
              >
                Location
              </label>

              <input
                id={`location-${event._id}`}
                name="location"
                required
                defaultValue={event.location ?? ""}
                className={fieldClass}
              />
            </div>

            <div>
              <label
                htmlFor={`date-${event._id}`}
                className={labelClass}
              >
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

            <div>
              <label
                htmlFor={`capacity-${event._id}`}
                className={labelClass}
              >
                Maximum participants
              </label>

              <input
                id={`capacity-${event._id}`}
                name="capacity"
                type="number"
                min={Math.max(1, event.joinedCount ?? 0)}
                required
                defaultValue={event.capacity ?? 50}
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
      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => !deleting && setDeleteOpen(open)}
      >
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
