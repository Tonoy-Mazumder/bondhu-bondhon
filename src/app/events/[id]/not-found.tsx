import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-[#F8F7F0]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-24 text-center md:px-6 md:py-32">
        <p className="inline-flex size-16 items-center justify-center rounded-full bg-[#D9F99D] text-3xl">
          🔍
        </p>
        <h1 className="mt-6 text-2xl font-extrabold text-[#14532D] sm:text-3xl lg:text-4xl">
          Event not found
        </h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-[#647067]">
          This event may have been removed, or the link you followed is
          incorrect.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/upcoming-events"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#14532D] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#14532D]/90 sm:w-auto"
          >
            Back to Upcoming Events
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#14532D]/40 bg-white px-6 text-sm font-semibold text-[#14532D] transition-colors hover:bg-[#14532D]/5 sm:w-auto"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
