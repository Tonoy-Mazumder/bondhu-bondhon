
import Link from "next/link";
import {
  Package,
  Shirt,
  Sprout,
  Trash2,
  Users,
  Utensils,
} from "lucide-react";

const categories = [
  {
    title: "Tree Plantation",
    icon: Sprout,
    iconBg: "bg-[#D9F99D]",
    href: "/categories/tree-plantation",
  },
  {
    title: "Cleanup Campaigns",
    icon: Trash2,
    iconBg: "bg-[#DDEBE0]",
    href: "/categories/cleanup-campaigns",
  },
  {
    title: "Donations",
    icon: Package,
    iconBg: "bg-[#FBE9D0]",
    href: "/categories/donations",
  },
  {
    title: "Winter Clothes",
    icon: Shirt,
    iconBg: "bg-[#E2EAF3]",
    href: "/categories/winter-clothes",
  },
  {
    title: "Food Donation",
    icon: Utensils,
    iconBg: "bg-[#F9E2DC]",
    href: "/categories/food-donation",
  },
  {
    title: "Community Support",
    icon: Users,
    iconBg: "bg-[#D9F99D]",
    href: "/categories/community-support",
  },
];

export function EventCategories() {
  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Find your kind of cause
          </h2>

          <p className="mt-4 text-base text-muted-foreground">
            Six ways to give back close to home.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                href={category.href}
                className="rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <span
                  className={`flex size-12 items-center justify-center rounded-xl ${category.iconBg}`}
                >
                  <Icon className="size-5 text-[#14532D]" />
                </span>

                <h3 className="mt-5 text-xl font-extrabold text-foreground">
                  {category.title}
                </h3>

                <p className="mt-1.5 text-sm text-muted-foreground">
                  Find nearby events and join in.
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
