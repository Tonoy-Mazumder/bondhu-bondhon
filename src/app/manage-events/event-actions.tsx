
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
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

const EVENT_TYPES = [
  "Environment",
  "Community Service",
  "Education",
  "Health",
  "Donation",
  "Animal Welfare",
  "Other",
];

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[#14532D] focus:ring-2 focus:ring-[#D9F99D]";

const labelClass = "mb-2 block text-sm font-semibold text-foreground";

type EventItem = {
  _id: string;
  title: string;
  description?: string;
  category?: string | null;
  image?: string | null;
  location?: string;
  date: string;
  startTime?: string;
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

    if (
      !Number.isInteger(capacity) ||
      capacity < 1 ||
      capacity > 10000
    ) {
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

    const selectedDate = new Date(`${data.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      !data.date ||
      selectedDate < today ||
      isNaN(selectedDate.getTime())
    ) {
      setEditError("Event date must be today or a future date.");
      setSaving(false);
      return;
    }

    if (
      typeof data.startTime !== "string" ||
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(data.startTime)
    ) {
      setEditError("Please enter a valid event start time.");
      setSaving(false);
      return;
    }

    try {
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication token not found");
      }

      const res = await fetch(`${API}/events/${event._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          ...data,
          capacity,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update event");
      }

      setEditOpen(false);

      toast.add({
        title: "Event updated successfully!",
        type: "success",
      });

      router.refresh();
    } catch (error) {
      console.error(error);

      setEditError(
        error instanceof Error
          ? error.message
          : "Failed to update event. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError("");

    try {
      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication token not found");
      }

      const res = await fetch(`${API}/events/${event._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete event");
      }

      setDeleteOpen(false);

      toast.add({
        title: "Event deleted successfully!",
        type: "success",
      });

      router.refresh();
    } catch (error) {
      console.error(error);

      setDeleteError(
        error instanceof Error
          ? error.message
          : "Failed to delete event. Please try again."
      );
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
          className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-xs font-semibold text-[#14532D] transition-colors hover:bg-muted dark:text-green-400"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => {
            setDeleteError("");
            setDeleteOpen(true);
          }}
          className="inline-flex h-10 items-center rounded-lg border border-border bg-background px-4 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          Delete
        </button>
      </div>

      {/* Edit dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={(open) => !saving && setEditOpen(open)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background text-foreground sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-foreground">
              Edit event
            </DialogTitle>

            <DialogDescription className="text-muted-foreground">
              Update the details of your event.
            </DialogDescription>
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
              <label htmlFor={`date-${event._id}`} className={labelClass}>
                Event date
              </label>

              <input
                id={`date-${event._id}`}
                name="date"
                type="date"
                required
                defaultValue={event.date?.slice(0, 10)}
                min={new Date().toLocaleDateString("en-CA")}
                className={fieldClass}
              />
            </div>

            {/* Event start time */}
            <div>
              <label
                htmlFor={`startTime-${event._id}`}
                className={labelClass}
              >
                Event start time
              </label>

              <input
                id={`startTime-${event._id}`}
                name="startTime"
                type="time"
                required
                defaultValue={event.startTime ?? "09:00"}
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
                max="10000"
                required
                defaultValue={event.capacity ?? 50}
                className={fieldClass}
              />
            </div>

            {editError && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
              >
                {editError}
              </p>
            )}

            <DialogFooter className="gap-2 sm:justify-start">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={saving}
                className="h-11 rounded-xl border-border px-6 font-semibold text-foreground hover:bg-muted"
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
        <DialogContent className="rounded-2xl border border-border bg-background text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-foreground">
              Delete this event?
            </DialogTitle>

            <DialogDescription className="text-muted-foreground">
              This can't be undone. People who joined will no longer see it.
            </DialogDescription>
          </DialogHeader>

          <p className="truncate text-sm font-medium text-foreground">
            {event.title}
          </p>

          {deleteError && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
            >
              {deleteError}
            </p>
          )}

          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
              className="h-11 rounded-xl border-border px-6 font-semibold text-foreground hover:bg-muted"
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
