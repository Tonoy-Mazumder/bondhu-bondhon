"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import heroPhoto from "@/assets/Young Volunteers Planting a Community Tree.png";

/* Maximum tilt in degrees on each axis */
const MAX_TILT = 6;

/* Flat tilt used when resting / for reduced motion */
const FLAT = "rotateX(0deg) rotateY(0deg)";

export function HeroVisual() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  /* Frame handle so scheduled tilts can be cancelled */
  const frameRef = useRef(0);

  /* Latest raw pointer position; coords are normalized per frame */
  const pointerRef = useRef({ clientX: 0, clientY: 0 });

  useEffect(
    () => () => {
      cancelAnimationFrame(frameRef.current);
    },
    []
  );

  function scheduleTilt(e: React.PointerEvent<HTMLDivElement>) {
    // Touch scrolling must never tilt the visual.
    if (e.pointerType === "touch") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    pointerRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
    };

    // Coalesce at most one layout-read/style-write pair per frame.
    if (frameRef.current) return;

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;

      const wrapper = wrapperRef.current;
      const stage = stageRef.current;

      if (!wrapper || !stage) return;

      const rect = wrapper.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const x = Math.min(
        Math.max((pointerRef.current.clientX - rect.left) / rect.width, 0),
        1
      );

      const y = Math.min(
        Math.max((pointerRef.current.clientY - rect.top) / rect.height, 0),
        1
      );

      // While tilting, snap directly to the target so the card tracks
      // the cursor; the ease-out transition only runs on release.
      stage.style.transition = "none";
      stage.style.transform = `rotateX(${(
        (0.5 - y) *
        MAX_TILT *
        2
      ).toFixed(2)}deg) rotateY(${((x - 0.5) * MAX_TILT * 2).toFixed(
        2
      )}deg)`;
    });
  }

  function resetTilt() {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;

    const stage = stageRef.current;

    if (!stage) return;

    stage.style.willChange = "auto";
    stage.style.transition = "transform 250ms ease-out";
    stage.style.transform = FLAT;
  }

  function handlePointerEnter(e: React.PointerEvent<HTMLDivElement>) {
    // Promote to a compositor layer only while interacting.
    if (e.pointerType !== "touch") {
      const stage = stageRef.current;

      if (stage) {
        stage.style.willChange = "transform";
      }
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full [perspective:1200px]"
      onPointerEnter={handlePointerEnter}
      onPointerMove={scheduleTilt}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
    >
      <div
        ref={stageRef}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        {/* Decorative glow behind the photo (gradient rasterizes cheaply,
            unlike a blur filter on a transformed layer) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 rounded-[2rem] [background:radial-gradient(closest-side,rgba(217,249,157,0.45),transparent)] [transform:translateZ(-60px)]"
        />

        {/* Photo frame */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-[#14532D]/40 bg-muted shadow-[0_25px_50px_-12px_rgba(20,83,45,0.35)]">
          <Image
            src={heroPhoto}
            alt="Volunteers planting a community tree together"
            className="h-full w-full object-cover"
            placeholder="blur"
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        {/* Floating stat card: active volunteers */}
        <div className="absolute right-3 top-3 rounded-xl border border-border bg-card p-3 shadow-lg [transform:translateZ(24px)] md:right-5 md:top-5 md:p-4 md:[transform:translateZ(60px)]">
          <p className="text-sm font-extrabold text-[#14532D] md:text-base">
            980
          </p>

          <p className="mt-1 text-[11px] text-muted-foreground md:text-xs">
            Active volunteers
          </p>
        </div>

        {/* Floating stat card: events this month */}
        <div className="absolute bottom-3 left-3 rounded-xl border border-border bg-card p-3 shadow-lg [transform:translateZ(35px)] md:bottom-5 md:left-5 md:p-4 md:[transform:translateZ(70px)]">
          <p className="text-sm font-extrabold text-[#14532D] md:text-base">
            18
          </p>

          <p className="mt-1 text-[11px] text-muted-foreground md:text-xs">
            Events this month
          </p>
        </div>
      </div>
    </div>
  );
}
