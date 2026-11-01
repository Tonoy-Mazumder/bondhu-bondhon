import Image from "next/image";
import treePlanting from "@/assets/Tree planting.png";
import cleanupCampaign from "@/assets/Cleanup Campaign.png";
import clothingDistribution from "@/assets/Clothing distribution.jpg";
import foodDonation from "@/assets/Food donation.jpg";

const galleryItems = [
  { caption: "Tree planting", src: treePlanting, alt: "Volunteers planting trees together" },
  {
    caption: "Cleanup campaign",
    src: cleanupCampaign,
    alt: "Volunteers cleaning up a public space",
  },
  {
    caption: "Clothing distribution",
    src: clothingDistribution,
    alt: "Volunteers distributing warm clothes",
  },
  {
    caption: "Food donation",
    src: foodDonation,
    alt: "Volunteers packing and sharing donated food",
  },
];

const steps = [
  {
    number: "1",
    title: "Discover a local event",
    description: "Browse upcoming events near you by type and date.",
  },
  {
    number: "2",
    title: "Join a cause you care about",
    description: "Sign in and join with one click.",
  },
  {
    number: "3",
    title: "Make a meaningful difference",
    description: "Show up, help out, and see your community grow.",
  },
];

export function ImpactGallery() {
  return (
    <section className="border-t border-border/40 bg-[#F8F7F0]">
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-16 md:px-6 md:pt-20 md:pb-20 lg:pt-24 lg:pb-24">
        {/* Community Impact Gallery */}
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#14532D] sm:text-4xl lg:text-5xl">
            Community Impact Gallery
          </h2>
          <p className="mt-4 text-base text-[#647067]">
            Moments from neighbors showing up for each other.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4 lg:gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.caption}
              className="relative h-56 overflow-hidden rounded-2xl border-2 border-dashed border-[#14532D]/30 bg-[#DCE8DC]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                placeholder="blur"
                className="object-cover"
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mx-auto mt-24 max-w-xl text-center md:mt-32">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#14532D] sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-10 text-center sm:grid-cols-3 md:mt-16">
          {steps.map((step) => (
            <div key={step.number}>
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#14532D] text-xl font-extrabold text-[#D9F99D]">
                {step.number}
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-[#14532D]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#647067]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
