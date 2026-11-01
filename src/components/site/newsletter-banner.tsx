"use client";

import { useState } from "react";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    // No newsletter backend yet: accept locally and confirm, wire up later.
    setSubscribed(true);
    setEmail("");
  }

  return (
    <section className="bg-[#F8F7F0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:py-24">
        <div className="rounded-3xl bg-[#14532D] px-6 py-14 text-center md:px-12 md:py-16 lg:py-20">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Stay close to your community
          </h2>
          <p className="mt-4 text-base text-emerald-100/85">
            Get new local events in your inbox. No spam, just good news.
          </p>

          {subscribed ? (
            <p className="mt-8 inline-block rounded-full bg-[#D9F99D] px-6 py-3 text-sm font-semibold text-[#14532D]">
              Thanks — you&apos;re on the list!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-lg sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="h-12 flex-1 rounded-xl border-0 bg-white px-5 text-sm text-[#292524] placeholder:text-[#647067] focus:outline-2 focus:outline-offset-2 focus:outline-[#D9F99D]"
              />
              <button
                type="submit"
                className="h-12 shrink-0 rounded-xl bg-[#D9F99D] px-6 text-sm font-semibold text-[#14532D] transition-colors hover:bg-[#D9F99D]/85"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
