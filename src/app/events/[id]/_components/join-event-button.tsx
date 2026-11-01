"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

type JoinEventButtonProps = {
  title: string;
  joinedCount: number;
  capacity: number;
};

export function JoinEventButton({
  title,
  joinedCount,
  capacity,
}: JoinEventButtonProps) {
  const [status, setStatus] = useState<
    "idle" | "joining" | "joined" | "cancelling"
  >("idle");

  const isJoined = status === "joined";
  const isJoining = status === "joining";
  const isCancelling = status === "cancelling";

  async function handleJoin() {
    if (status !== "idle") return;
    setStatus("joining");
    // simulated join call — swap for the real API when it exists
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStatus("joined");
    toast.add({
      title: "You're joined!",
      description: `Your spot for "${title}" is confirmed. See you there!`,
      type: "success",
    });
  }

  async function handleCancel() {
    if (status !== "joined") return;
    setStatus("cancelling");
    // simulated cancel call — swap for the real API when it exists
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStatus("idle");
    toast.add({
      title: "Spot cancelled",
      description: `Your spot for "${title}" was released.`,
      type: "info",
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={handleJoin}
        disabled={isJoined || isJoining || isCancelling}
        aria-live="polite"
        className={`h-11 w-full rounded-lg text-sm font-semibold transition-all duration-300 ${
          isJoined || isCancelling
            ? "bg-[#D9F99D] text-[#14532D]"
            : "bg-[#14532D] text-white hover:bg-[#14532D]/90 active:scale-95"
        } ${isJoined ? "animate-in fade-in zoom-in-95" : ""}`}
      >
        {isJoined ? (
          <span className="inline-flex items-center justify-center gap-2">
            <CheckCircle2 className="size-4" aria-hidden />
            You&apos;re joined this event
          </span>
        ) : isJoining ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Joining…
          </span>
        ) : isCancelling ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Cancelling…
          </span>
        ) : (
          "Join Event"
        )}
      </button>

      {isJoined && (
        <button
          type="button"
          onClick={handleCancel}
          disabled={isCancelling}
          className="mt-2 h-9 w-full rounded-lg border border-border bg-white text-xs font-semibold text-[#647067] transition-colors hover:border-[#14532D]/40 hover:text-[#14532D]"
        >
          Cancel your spot
        </button>
      )}

      <p className="mt-3 text-center text-xs text-[#647067]">
        {joinedCount + (isJoined ? 1 : 0)} of {capacity} volunteers joined
      </p>
    </>
  );
}
