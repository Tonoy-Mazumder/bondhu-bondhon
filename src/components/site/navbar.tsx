"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { href: "/", label: "Home" },
  { href: "/upcoming-events", label: "Upcoming Events" },
];

const accountLinks = [
  { href: "/create-event", label: "Create Event" },
  { href: "/manage-events", label: "Manage Events" },
  { href: "/joined-events", label: "Joined Events" },
];

type SessionUser = {
  name: string;
  email: string;
  image?: string | null;
};

function getInitials(name?: string) {
  if (!name) return "BB";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "BB";
}

/* ---------------- Profile update dialog ---------------- */

function ProfileForm({
  user,
  onDone,
}: {
  user: SessionUser;
  onDone: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name ?? "");
  const [image, setImage] = useState(user.image ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedImage = image.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (trimmedImage) {
      try {
        new URL(trimmedImage);
      } catch {
        setError("Photo URL must be a valid link, e.g. https://...");
        return;
      }
    }

    setSaving(true);
    try {
      const { error } = await authClient.updateUser({
        name: trimmedName,
        image: trimmedImage || undefined,
      });

      if (error) {
        setError(error.message ?? "Could not update your profile.");
        return;
      }

      router.refresh();
      onDone();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="size-16 border border-[#14532D]/30 bg-[#DCE8DC]">
          <AvatarImage src={image.trim() || undefined} alt="Preview" />
          <AvatarFallback className="bg-[#DCE8DC] text-base font-semibold text-[#14532D]">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <p className="text-xs text-[#647067]">
          Preview updates as you type the photo URL.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-name">Name</Label>
        <Input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-email">Email</Label>
        <Input id="profile-email" value={user.email} disabled readOnly />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-image">Photo URL</Label>
        <Input
          id="profile-image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://"
          inputMode="url"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="bg-[#14532D] text-white hover:bg-[#14532D]/90"
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function ProfileDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: SessionUser;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-[#14532D]">
            Update profile
          </DialogTitle>
          <DialogDescription>
            Change your name and profile photo.
          </DialogDescription>
        </DialogHeader>
        {/* Mounts fresh each time the dialog opens, so fields reset to current values */}
        <ProfileForm user={user} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Navbar ---------------- */

export function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as SessionUser | undefined;

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  async function handleLogout() {
    setOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  }

  function openProfile() {
    setOpen(false);
    setProfileOpen(true);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-[#FCFBF7]">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#14532D] md:size-12">
            <Leaf className="size-5 text-white md:size-6" strokeWidth={2.2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-[#14532D] md:text-2xl">
              BondhuBondhon
            </span>
            <span className="mt-1 text-[11px] text-[#647067] md:text-xs">
              Together for a Better Community
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#292524] transition-colors hover:text-[#14532D]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-12 w-44 animate-pulse rounded-full bg-[#DCE8DC]/60" />
          ) : user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Open account menu"
                  className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#D9F99D]"
                >
                  <Avatar className="size-12 border border-dashed border-[#14532D]/40 bg-[#DCE8DC]">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className="bg-[#DCE8DC] text-sm font-semibold text-[#14532D]">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={12}
                  className="w-56 rounded-2xl border border-border/60 bg-white p-2 shadow-lg"
                >
                  <div className="px-4 py-2">
                    <p className="truncate text-sm font-semibold text-[#292524]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#647067]">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />

                  {accountLinks.map((link) => (
                    <DropdownMenuItem
                      key={link.href}
                      render={<Link href={link.href} />}
                      className="cursor-pointer rounded-lg px-4 py-2.5 text-sm text-[#292524] focus:bg-[#F8F7F0] focus:text-[#14532D]"
                    >
                      {link.label}
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={openProfile}
                    className="cursor-pointer rounded-lg px-4 py-2.5 text-sm text-[#292524] focus:bg-[#F8F7F0] focus:text-[#14532D]"
                  >
                    Update profile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="h-10 rounded-lg border-[#14532D] bg-transparent px-5 font-medium text-[#292524] hover:bg-[#14532D]/5"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-lg border border-[#14532D] px-5 text-sm font-medium text-[#292524] transition-colors hover:bg-[#14532D]/5"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-10 items-center rounded-lg bg-[#14532D] px-5 text-sm font-medium text-white transition-colors hover:bg-[#14532D]/90"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border/60 bg-[#FCFBF7] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#292524] transition-colors hover:text-[#14532D]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isPending ? null : user ? (
              <>
                <div className="flex items-center gap-3 border-t border-border/60 pt-4">
                  <Avatar className="size-10 border border-dashed border-[#14532D]/40 bg-[#DCE8DC]">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className="bg-[#DCE8DC] text-xs font-semibold text-[#14532D]">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#292524]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#647067]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {accountLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-[#292524] transition-colors hover:text-[#14532D]"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={openProfile}
                    className="text-left text-sm text-[#292524] transition-colors hover:text-[#14532D]"
                  >
                    Update profile
                  </button>
                </div>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="mt-2 h-10 rounded-lg border-[#14532D] bg-transparent text-[#292524] hover:bg-[#14532D]/5"
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-3 border-t border-border/60 pt-4">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-[#14532D] text-sm font-medium text-[#292524] hover:bg-[#14532D]/5"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-[#14532D] text-sm font-medium text-white hover:bg-[#14532D]/90"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Profile dialog (rendered once, opened from desktop or mobile) */}
      {user && (
        <ProfileDialog
          open={profileOpen}
          onOpenChange={setProfileOpen}
          user={user}
        />
      )}
    </header>
  );
}