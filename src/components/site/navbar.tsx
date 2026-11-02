"use client";

import Link from "next/link";
import { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

export function Navbar() {
  const [open, setOpen] = useState(false);

  function handleLogout() {
    // TODO: call your auth sign-out here
    setOpen(false);
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
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Open account menu"
              className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#D9F99D]"
            >
              <Avatar className="size-12 border border-dashed border-[#14532D]/40 bg-[#DCE8DC]">
                <AvatarImage src="" alt="Your profile" />
                <AvatarFallback className="bg-[#DCE8DC] text-sm font-semibold text-[#14532D]">
                  BB
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={12}
              className="w-52 rounded-2xl border border-border/60 bg-white p-2 shadow-lg"
            >
              {accountLinks.map((link) => (
                <DropdownMenuItem
                  key={link.href}
                  render={<Link href={link.href} />}
                  className="cursor-pointer rounded-lg px-4 py-2.5 text-sm text-[#292524] focus:bg-[#F8F7F0] focus:text-[#14532D]"
                >
                  {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="h-10 rounded-lg border-[#14532D] bg-transparent px-5 font-medium text-[#292524] hover:bg-[#14532D]/5"
          >
            Logout
          </Button>
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

            <div className="flex flex-col gap-4 border-t border-border/60 pt-4">
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
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="mt-2 h-10 rounded-lg border-[#14532D] bg-transparent text-[#292524] hover:bg-[#14532D]/5"
            >
              Logout
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}