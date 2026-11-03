
import Link from "next/link";
import { HeroVisual } from "./hero-visual";

const stats = [
  { value: "1,200", label: "Community events" },
  { value: "980", label: "Active volunteers" },
  { value: "45", label: "Completed initiatives" },
];

export function Hero() {
  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Copy */}
          <div>
            <span className="inline-block rounded-full bg-[#D9F99D] px-4 py-1.5 text-sm font-semibold text-[#14532D]">
              Local community-service events
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Together, We Can Make a Difference.
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Organize or join neighborhood events like tree plantations,
              cleanups, food drives, and clothing distributions, and meet the
              people next door.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/upcoming-events"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#14532D] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#14532D]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532D]/50 sm:w-auto"
              >
                Explore Events
              </Link>

              <Link
                href="/create-event"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#14532D]/40 bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14532D]/50 sm:w-auto"
              >
                Create an Event
              </Link>
            </div>
          </div>

          {/* 3D hero visual */}
          <HeroVisual />
        </div>

        {/* Stat cards */}
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3 md:mt-20">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card px-6 py-8"
            >
              <p className="text-4xl font-extrabold tracking-tight text-foreground">
                {stat.value}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
