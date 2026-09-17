import type { Metadata } from "next";
import { SiteHeader, SiteFooter, SkipLink } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Waitlist privacy",
  description: "How information is handled on the 9inetales waitlist website.",
};

export default function PrivacyPage() {
  return (
    <>
      <SkipLink />
      <SiteHeader mode="privacy" />
      <main className="wrap section-space privacy-page" id="main">
        <p className="eyebrow">9inetales / Your privacy</p>
        <h1>Waitlist privacy.</h1>
        <p className="privacy-intro">
          This notice explains how information is handled when you visit the
          9inetales waitlist website or use its signup form.
        </p>
        <div className="privacy-sections">
          <section aria-labelledby="privacy-form">
            <h2 id="privacy-form">Information you enter</h2>
            <p>
              The form lets you enter an email address, choose reader, creator,
              or both, and select an email preference. These entries stay in the
              page while you use it. Email registration is not yet active: the
              form does not send your information to 9inetales, save a signup,
              or add you to a mailing list. No confirmation or update emails are
              sent.
            </p>
          </section>
          <section aria-labelledby="privacy-storage">
            <h2 id="privacy-storage">Storage and retention</h2>
            <p>
              Form entries are held temporarily in the page’s memory. The email
              field clears after completing the form. Reloading the page clears
              the information held by this website. Optional answers are not
              sent or saved. We do not store form entries in cookies, local
              storage, or session storage, and there is no stored signup record
              to retain or delete.
            </p>
            <p>
              Your browser may offer autofill or restore form fields according
              to your browser settings. Those features are controlled by your
              browser.
            </p>
          </section>
          <section aria-labelledby="privacy-requests">
            <h2 id="privacy-requests">Website requests and hosting</h2>
            <p>
              Your browser requests the pages, fonts, and images needed to
              display this website. The hosting service may receive technical
              information such as your IP address, browser details, requested
              pages, and request times when serving those files. Any hosting
              access logs are handled under the hosting provider’s own policies.
            </p>
          </section>
          <section aria-labelledby="privacy-tracking">
            <h2 id="privacy-tracking">Cookies, analytics, and sharing</h2>
            <p>
              This website does not set cookies or use analytics tools,
              advertising trackers, or a mailing-list service. Fonts and images
              are served from this website. Form entries are not shared with
              email providers or advertisers.
            </p>
          </section>
          <section aria-labelledby="privacy-choice">
            <h2 id="privacy-choice">Your choices and future updates</h2>
            <p>
              You can browse without entering any information and clear form
              entries by reloading the page. Because email registration is not
              active, there is no current email subscription to unsubscribe
              from.
            </p>
            <p>
              If we enable waitlist registration, we will update this notice
              before collecting signups to explain who manages your information,
              how to contact us, why information is collected, which services
              process it, how long it is kept, and how to unsubscribe or request
              access or deletion.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
