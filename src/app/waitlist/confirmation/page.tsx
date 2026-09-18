import type { Metadata } from "next";
import { SiteHeader, SiteFooter, SkipLink } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Waitlist email confirmation",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <>
      <SkipLink />
      <SiteHeader mode="privacy" />
      <main className="wrap section-space privacy-page" id="main">
        <h1>Thank you for confirming.</h1>
        <p className="privacy-intro">
          Thank you for your interest in 9inetales. We look forward to sharing
          our progress with you.
        </p>
        <p>
          Confirming your email through the link in your inbox completes your
          signup. You can unsubscribe at any time using the link in each email.
        </p>
        <a className="text-action" href="/">
          Return to 9inetales <span aria-hidden="true">→</span>
        </a>
      </main>
      <SiteFooter />
    </>
  );
}
