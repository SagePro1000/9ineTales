import type { Metadata } from "next";
import { SiteHeader, SiteFooter, SkipLink } from "@/components/site-shell";
import { getWaitlistConfig } from "@/lib/waitlist/config";

export const metadata: Metadata = {
  title: "Waitlist privacy",
  description: "How information is handled on the 9inetales waitlist website.",
};

export default function PrivacyPage() {
  const config = getWaitlistConfig();
  if (config)
    return (
      <>
        <SkipLink />
        <SiteHeader mode="privacy" />
        <main className="wrap section-space privacy-page" id="main">
          <h1>Waitlist privacy.</h1>
          <p className="privacy-intro">
            {config.operator} manages the 9inetales waitlist. Contact{" "}
            <a href={`mailto:${config.privacyEmail}`}>{config.privacyEmail}</a>{" "}
            about your information or a deletion request.
          </p>
          <div className="privacy-sections">
            <section aria-labelledby="privacy-form">
              <h2 id="privacy-form">What we collect and why</h2>
              <p>
                When you request to join, we send your email address,
                reader/creator/both preference, signup and consent times, and
                consent wording version to Brevo. We also save a campaign source
                when a valid utm_source is present; otherwise the source is
                “website”. We use these details to manage the waitlist and send
                the updates you requested.
              </p>
              <p>
                Brevo handles email confirmation. Updates are limited to
                confirmed contacts on the waitlist who remain subscribed and are
                eligible to receive email. Joining as a creator expresses
                interest; it does not submit work or agree to publishing or
                payment terms.
              </p>
            </section>
            <section aria-labelledby="privacy-providers">
              <h2 id="privacy-providers">Services and spam protection</h2>
              <p>
                Vercel hosts the website and processes signup requests. Brevo
                stores contact information, processes confirmation emails and
                subscription events, and handles update delivery and unsubscribe
                records. These services may process information outside your
                country.
              </p>
              <p>
                We use Upstash Redis for shared request limits and to protect
                pending preferences. It holds keyed hashes of email addresses
                and IP addresses, request counts, pending audience preferences,
                source, consent times, and consent wording version. It does not
                hold plaintext email addresses or IP addresses. These hashes are
                pseudonymous identifiers, not anonymous data.
              </p>
              <p>
                IP request counters expire after 10 minutes, daily counters
                after two days, and email-attempt locks after 10 minutes.
                Pending preference records expire 31 days after their most
                recent successful confirmation request or existing-contact
                check. An email confirmation link does not by itself authorize
                additional tracking on this website.
              </p>
            </section>
            <section aria-labelledby="privacy-retention">
              <h2 id="privacy-retention">Retention and your choices</h2>
              <p>{config.retention}</p>
              <p>
                You can browse without joining and unsubscribe using the link in
                each update. Public repeat submissions do not change an existing
                contact’s preferences or reverse an unsubscribe. Contact us to
                request access, correction, or deletion, including deletion of
                temporary spam-protection records. Brevo may retain delivery and
                suppression records under its service policies; suppression
                helps prevent further unwanted email.
              </p>
            </section>
            <section aria-labelledby="privacy-tracking">
              <h2 id="privacy-tracking">Website requests and tracking</h2>
              <p>
                The website itself does not store signup entries in cookies,
                local storage, or session storage, and it does not use
                advertising trackers or website analytics. Fonts and images are
                served from this website. Your browser may offer autofill under
                its own settings.
              </p>
              <p>
                Vercel may receive IP addresses, browser details, requested
                pages, and request times in hosting logs. Brevo records email
                delivery and confirmation events. Provider logs and any enabled
                email open or link tracking are handled under the providers’
                policies and account settings.
              </p>
            </section>
          </div>
        </main>
        <SiteFooter />
      </>
    );
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
