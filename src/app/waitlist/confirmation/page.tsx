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
          If you arrived here through a valid Brevo confirmation link, your
          email subscription has been confirmed.
        </p>
        <p>
          Opening this page directly does not create or verify a signup. You can
          unsubscribe from updates using the link in each email.
        </p>
        <a className="text-action" href="/">
          Return to 9inetales <span aria-hidden="true">→</span>
        </a>
      </main>
      <SiteFooter />
    </>
  );
}
