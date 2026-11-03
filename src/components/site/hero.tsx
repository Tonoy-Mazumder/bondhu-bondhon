
import Image from "next/image";
import Link from "next/link";
import heroPhoto from "@/assets/Young Volunteers Planting a Community Tree.png";
import { Button } from "@/components/ui/button";

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
              <Link href="/upcoming-events">
                <Button
                  size="lg"
                  className="w-full bg-[#14532D] text-white hover:bg-[#14532D]/90"
                >
                  Explore Events
                </Button>
              </Link>

              <Link href="/create-event">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-[#14532D]/40 bg-card text-foreground hover:bg-accent"
                >
                  Create an Event
                </Button>
              </Link>
            </div>
          </div>

          {/* Photo with floating stat cards */}
          <div className="relative w-full">
            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-[#14532D]/40 bg-muted">
              <Image
                src={heroPhoto}
                alt="Volunteers planting a community tree together"
                className="h-full w-full object-cover"
                placeholder="blur"
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
              />

              {/* Active volunteers */}
              <div className="absolute right-3 top-3 rounded-xl border border-border bg-card p-3 shadow-md md:right-5 md:top-5 md:p-4">
                <p className="text-sm font-extrabold text-[#14532D] md:text-base">
                  980
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground md:text-xs">
                  Active volunteers
                </p>
              </div>

              {/* Events this month */}
              <div className="absolute bottom-3 left-3 rounded-xl border border-border bg-card p-3 shadow-md md:bottom-5 md:left-5 md:p-4">
                <p className="text-sm font-extrabold text-[#14532D] md:text-base">
                  18
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground md:text-xs">
                  Events this month
                </p>
              </div>
            </div>
          </div>
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
