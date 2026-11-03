"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient, signIn } from "@/lib/auth-client";
import Image from "next/image";
import communityPhoto from "@/assets/Together for a Greener Tomorrow.png";
const fieldClass =
    "w-full rounded-xl border border-[#D6D3C9] bg-white px-4 py-3 text-sm text-[#292524] outline-none placeholder:text-[#647067]/70 focus:border-[#14532D] focus:ring-2 focus:ring-[#D9F99D]";

const labelClass = "mb-2 block text-sm font-semibold text-[#292524]";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

        const { error } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
        });

        if (error) {
            setError(error.message ?? "Could not log in. Check your email and password.");
            setSubmitting(false);
            return;
        }
        else {
            const { data: tokenData, error: tokenError } =
                await authClient.token();

            if (tokenError || !tokenData?.token) {
                console.error("JWT error:", tokenError);
                setError("Could not generate authentication token.");
                setSubmitting(false);
                return;
            }

            console.log("JWT:", tokenData.token);

            router.push("/");
            router.refresh();
        }
    }

    async function handleGoogle() {
        await signIn.social({ provider: "google", callbackURL: "/" });
    }

    return (
        <main className="grid min-h-screen bg-[#F8F7F0] lg:grid-cols-2">
            {/* Left: photo panel (hidden on mobile) */}
            <aside className="relative hidden bg-[#DDE7DC] lg:block">
                <Image
                    src={communityPhoto}
                    alt="Together for a Greener Tomorrow: neighbors working together"
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
                        <span className="font-serif text-xl font-bold text-[#14532D]">
                            BondhuBondhon
                        </span>
                    </div>

                    <h1 className="mt-5 font-serif text-4xl font-bold text-[#14532D]">
                        Welcome back
                    </h1>
                    <p className="mt-3 text-sm text-[#647067]">
                        Log in to join and manage community events.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                        <div>
                            <label htmlFor="email" className={labelClass}>Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                placeholder="you@example.com"
                                className={fieldClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className={labelClass}>Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    className={`${fieldClass} pr-16`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute inset-y-0 right-4 text-xs text-[#647067] hover:text-[#14532D]"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p role="alert" className="text-sm text-red-700">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-xl bg-[#14532D] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#14532D]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9F99D] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? "Logging in..." : "Log in"}
                        </button>

                        <p className="text-center text-sm text-[#647067]">or</p>

                        <button
                            type="button"
                            onClick={handleGoogle}
                            className="w-full rounded-xl border border-[#D6D3C9] bg-white px-4 py-3 text-sm font-semibold text-[#292524] transition-colors hover:bg-[#F8F7F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9F99D]"
                        >
                            Continue with Google
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-[#647067]">
                        New here?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-[#14532D] underline underline-offset-2"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}