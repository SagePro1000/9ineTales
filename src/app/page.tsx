import { HeroSection } from "@/components/waitlist/hero-section";
import { StoryStrip } from "@/components/waitlist/story-strip";
import { ReaderSection } from "@/components/waitlist/reader-section";
import { CreatorSection } from "@/components/waitlist/creator-section";
import { ProcessSection } from "@/components/waitlist/process-section";
import { WaitlistSection } from "@/components/waitlist/waitlist-section";
import { FaqSection } from "@/components/waitlist/faq-section";
import { WaitlistProvider } from "@/components/waitlist/waitlist-context";
import {
  SiteHeader,
  SiteFooter,
  PreviewBar,
  SkipLink,
} from "@/components/site-shell";

export default function HomePage() {
  return (
    <WaitlistProvider>
      <SkipLink />
      <PreviewBar />
      <SiteHeader />
      <main id="main">
        <HeroSection />
        <StoryStrip />
        <ReaderSection />
        <CreatorSection />
        <ProcessSection />
        <WaitlistSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </WaitlistProvider>
  );
}
