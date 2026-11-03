
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient, signUp } from "@/lib/auth-client";
import communityPhoto from "@/assets/Together for a Greener Tomorrow.png";

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[#14532D] focus:ring-2 focus:ring-[#D9F99D]";

const labelClass = "mb-2 block text-sm font-semibold text-foreground";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validateEmail(value: string) {
    const ok = emailRegex.test(value.trim());
    setEmailError(ok ? "" : "Enter a valid email address");
    return ok;
  }

  function validatePassword(value: string) {
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must contain an uppercase letter";
    }

    if (!/[a-z]/.test(value)) {
      return "Password must contain a lowercase letter";
    }

    return "";
  }

  function validateImageUrl(value: string) {
    if (!value.trim()) return true;

    try {
      const url = new URL(value.trim());
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setError("");

    const data = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as Record<string, string>;

    if (!data.name?.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(data.email ?? "")) return;

    const passwordError = validatePassword(data.password ?? "");

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!validateImageUrl(data.image ?? "")) {
      setError("Please enter a valid photo URL");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await signUp.email({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        ...(data.image?.trim()
          ? { image: data.image.trim() }
          : {}),
      });

      if (error) {
        throw new Error(
          error.message ??
            "Could not create your account. Please try again."
        );
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Could not create your account. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    try {
      setSubmitting(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error(error);
      setError("Google sign-in failed. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-2">
      {/* Left: photo panel */}
      <aside className="relative hidden bg-muted lg:block">
        <Image
          src={communityPhoto}
          alt="Volunteers planting trees together"
          fill
          priority
          sizes="50vw"
          className="object-cover object-left"
        />
      </aside>

      {/* Right: form */}
      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[412px]">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-[#14532D]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D9F99D"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
                <path d="M5 19c2-5 5-8 9-10" />
              </svg>
            </span>

            <span className="font-serif text-xl font-bold text-[#14532D] dark:text-green-400">
              BondhuBondhon
            </span>
          </div>

          <h1 className="mt-5 font-serif text-4xl font-bold text-foreground">
            Join BondhuBondhon
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Create an account to organize and join events.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-5 space-y-4"
          >
            {/* Name */}
            <div>
              <label htmlFor="name" className={labelClass}>
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your full name"
                className={fieldClass}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!emailError}
                aria-describedby={
                  emailError ? "email-error" : undefined
                }
                onBlur={(e) =>
                  e.target.value && validateEmail(e.target.value)
                }
                onChange={() => emailError && setEmailError("")}
                className={fieldClass}
              />

              {emailError && (
                <p
                  id="email-error"
                  className="mt-1.5 text-xs text-red-600 dark:text-red-400"
                >
                  {emailError}
                </p>
              )}
            </div>

            {/* Photo URL */}
            <div>
              <label htmlFor="image" className={labelClass}>
                Photo URL
              </label>

              <input
                id="image"
                name="image"
                type="url"
                placeholder="https://"
                className={fieldClass}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  className={`${fieldClass} pr-16`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute inset-y-0 right-4 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-muted-foreground">
                Must contain uppercase and lowercase letters.
              </p>
            </div>

            {/* Error */}
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#14532D] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#166534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9F99D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              or
            </p>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={submitting}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9F99D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue with Google
            </button>
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            Already a member?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#14532D] underline underline-offset-2 dark:text-green-400"
            >
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
