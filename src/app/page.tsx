import { Hero } from "@/components/site/hero";
import { EventCategories } from "@/components/site/event-categories";
import { UpcomingEvents } from "@/components/site/upcoming-events";
import { ImpactGallery } from "@/components/site/impact-gallery";
import { NewsletterBanner } from "@/components/site/newsletter-banner";

export default function Home() {
  return (
    <>
      <Hero />
      <EventCategories />
      <UpcomingEvents />
      <ImpactGallery />
      <NewsletterBanner />
    </>
  );
}
