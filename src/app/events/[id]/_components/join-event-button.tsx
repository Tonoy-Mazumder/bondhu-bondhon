
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type JoinEventButtonProps = {
  eventId: string;
  title: string;
  joinedCount: number;
  initialJoined: boolean;
  capacity: number;
};

export function JoinEventButton({
  eventId,
  title,
  joinedCount,
  initialJoined,
  capacity,
}: JoinEventButtonProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const [status, setStatus] = useState<
    "idle" | "joining" | "joined" | "cancelling"
  >(initialJoined ? "joined" : "idle");

  const isJoined = status === "joined";
  const isJoining = status === "joining";
  const isCancelling = status === "cancelling";

  const othersCount = joinedCount - (initialJoined ? 1 : 0);
  const totalCount = Math.max(
    0,
    othersCount + (isJoined ? 1 : 0)
  );

  const isFull = totalCount >= capacity;

  async function handleJoin() {
    if (status !== "idle") return;

    if (!userId) {
      toast.add({
        title: "Please log in",
        description: "You need an account to join an event.",
        type: "error",
      });

      router.push("/login");
      return;
    }

    setStatus("joining");

    try {
      const res = await fetch(`${API}/events/${eventId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to join event");
      }

      setStatus("joined");

      toast.add({
        title: "You're joined!",
        description: `Your spot for "${title}" is confirmed.`,
        type: "success",
      });

      router.refresh();
    } catch (error) {
      setStatus("idle");

      toast.add({
        title: "Could not join",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    }
  }

  async function handleCancel() {
    if (status !== "joined" || !userId) return;

    setStatus("cancelling");

    try {
      const res = await fetch(`${API}/events/${eventId}/join`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel spot");
      }

      setStatus("idle");

      toast.add({
        title: "Spot cancelled",
        description: `Your spot for "${title}" was released.`,
        type: "info",
      });

      router.refresh();
    } catch (error) {
      setStatus("joined");

      toast.add({
        title: "Could not cancel",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleJoin}
        disabled={
          isJoined || isJoining || isCancelling || (isFull && !isJoined)
        }
        aria-live="polite"
        className={`h-11 w-full rounded-lg text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed ${
          isJoined || isCancelling
            ? "bg-[#D9F99D] text-[#14532D]"
            : isFull
              ? "bg-[#E3E1D6] text-[#647067]"
              : "bg-[#14532D] text-white hover:bg-[#14532D]/90 active:scale-95"
        }`}
      >
        {isJoined ? (
          <span className="inline-flex items-center justify-center gap-2">
            <CheckCircle2 className="size-4" />
            Youre joined this event
          </span>
        ) : isJoining ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Joining…
          </span>
        ) : isCancelling ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Cancelling…
          </span>
        ) : isFull ? (
          "Event is full"
        ) : (
          "Join Event"
        )}
      </button>

      {isJoined && (
        <button
          type="button"
          onClick={handleCancel}
          disabled={isCancelling}
          className="mt-2 h-9 w-full rounded-lg border border-border bg-white text-xs font-semibold text-[#647067] transition-colors hover:border-[#14532D]/40 hover:text-[#14532D] disabled:cursor-not-allowed"
        >
          Cancel your spot
        </button>
      )}

      <p className="mt-3 text-center text-xs text-[#647067]">
        {totalCount} of {capacity} volunteers joined
      </p>
    </>
  );
}
