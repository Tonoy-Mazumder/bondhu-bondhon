
import Link from "next/link";
import { Leaf } from "lucide-react";

const columns = [
  {
    title: "Quick Links",
    items: [
      { label: "Home", href: "/" },
      { label: "Upcoming Events", href: "/upcoming-events" },
      { label: "Create Event", href: "/create-event" },
    ],
  },
  {
    title: "Categories",
    items: [
      { label: "Tree Plantation", href: "/categories/tree-plantation" },
      { label: "Cleanup Campaigns", href: "/categories/cleanup-campaigns" },
      { label: "Food Donation", href: "/categories/food-donation" },
    ],
  },
  {
    title: "Contact",
    items: [
      { label: "[email address]", href: "mailto:hello@bondhubondhon.example" },
      { label: "[phone number]", href: "tel:+8800000000000" },
      { label: "[city, country]", href: "/contact" },
    ],
  },
  {
    title: "Follow",
    items: [
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Instagram", href: "https://instagram.com" },
      { label: "X", href: "https://x.com" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#14532D] text-emerald-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <span className="flex size-11 items-center justify-center rounded-xl bg-[#D9F99D]">
              <Leaf
                className="size-5 text-[#14532D]"
                strokeWidth={2.2}
              />
            </span>

            <p className="mt-4 text-xl font-bold tracking-tight text-white">
              BondhuBondhon
            </p>

            <p className="mt-3 text-sm leading-relaxed text-emerald-100/85">
              A platform connecting neighbors with local community-service
              events.
            </p>
          </div>

          {/* Link Columns */}
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-semibold text-white">
                {column.title}
              </h3>

              <ul className="mt-5 flex flex-col gap-3">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-emerald-100/80 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-emerald-100/20 pt-6">
          <p className="text-sm text-emerald-100/70">
            © 2026 BondhuBondhon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
