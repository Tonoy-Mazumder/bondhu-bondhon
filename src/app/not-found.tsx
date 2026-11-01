import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-[#F8F7F0]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-24 text-center md:px-6 md:py-32">
        <p className="text-7xl font-extrabold tracking-tight text-[#14532D] sm:text-8xl lg:text-9xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-extrabold text-[#292524] sm:text-3xl lg:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-[#647067]">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#14532D] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#14532D]/90 sm:w-auto"
          >
            Back to Home
          </Link>
          <Link
            href="/upcoming-events"
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-[#14532D]/40 bg-white px-6 text-sm font-semibold text-[#14532D] transition-colors hover:bg-[#14532D]/5 sm:w-auto"
          >
            Browse Upcoming Events
          </Link>
        </div>
      </div>
    </section>
  );
}
