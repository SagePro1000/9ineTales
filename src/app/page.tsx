import { HeroSection } from "@/components/waitlist/hero-section";
import { StoryStrip } from "@/components/waitlist/story-strip";
import { ReaderSection } from "@/components/waitlist/reader-section";
import { CreatorSection } from "@/components/waitlist/creator-section";
import { ProcessSection } from "@/components/waitlist/process-section";
import { WaitlistSection } from "@/components/waitlist/waitlist-section";
import { FaqSection } from "@/components/waitlist/faq-section";
import { WaitlistProvider } from "@/components/waitlist/waitlist-context";
import { SiteHeader, SiteFooter, SkipLink } from "@/components/site-shell";
import { getWaitlistConfig } from "@/lib/waitlist/config";

export default function HomePage() {
  const collectionEnabled = getWaitlistConfig() !== null;
  return (
    <WaitlistProvider>
      <SkipLink />
      <SiteHeader />
      <main id="main">
        <HeroSection collectionEnabled={collectionEnabled} />
        <StoryStrip />
        <ReaderSection />
        <CreatorSection />
        <ProcessSection />
        <WaitlistSection collectionEnabled={collectionEnabled} />
        <FaqSection collectionEnabled={collectionEnabled} />
      </main>
      <SiteFooter />
    </WaitlistProvider>
  );
}
