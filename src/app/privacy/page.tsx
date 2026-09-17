import type { Metadata } from "next";
import { SiteHeader, SkipLink } from "@/components/site-shell";
export const metadata: Metadata = { title: "Privacy & prototype" };
export default function PrivacyPage() {
  return (
    <>
      <SkipLink />
      <SiteHeader mode="privacy" />
      <main
        className="wrap section-space"
        style={{ maxWidth: "760px" }}
        id="main"
      >
        <p className="eyebrow">Design review / September 2026</p>
        <h1 style={{ fontSize: "clamp(3rem,7vw,5rem)" }}>
          Privacy &amp; this prototype.
        </h1>
        <div style={{ display: "grid", gap: "28px", marginTop: "36px" }}>
          <p>
            This is a design prototype for an upcoming 9inetales waitlist. Its
            signup form does not send, save, or collect email addresses, consent
            choices, or optional answers. It demonstrates validation and
            confirmation only.
          </p>
          <p>
            The page has no analytics, advertising integrations, or mailing-list
            service. Fonts and images are served with the prototype. The hosting
            service may process ordinary request and access information under
            its own policies.
          </p>
          <p>
            Before a real waitlist launches, this page must be replaced with an
            appropriate privacy notice identifying the operator, contact
            details, what information is collected, why it is used, relevant
            service providers, retention, and how people can unsubscribe or
            exercise their rights.
          </p>
          <p>
            The waitlist hero uses supplied comic artwork as a visual reference,
            credited to @mohammedawwall. The brand guide uses the same
            reference. These images are not evidence of a confirmed launch
            catalogue or creator partnership.
          </p>
          <p>
            Features and commercial terms described as planned or under
            exploration remain unconfirmed. Joining a future creator interest
            list will not grant publishing rights or create an entitlement to
            payment.
          </p>
        </div>
      </main>
    </>
  );
}
