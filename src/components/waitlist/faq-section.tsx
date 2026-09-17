export function FaqSection({
  collectionEnabled = false,
}: {
  collectionEnabled?: boolean;
}) {
  return (
    <section
      className="faq-section wrap section-space"
      id="questions"
      aria-labelledby="faq-title"
    >
      <div className="section-intro">
        <p className="eyebrow">A little more context</p>
        <h2 id="faq-title">
          Before the
          <br />
          first chapter.
        </h2>
        <p>Where we are today, and what we’re working toward.</p>
      </div>
      <div className="faq-list">
        <details>
          <summary>Is 9inetales available to read now?</summary>
          <p>
            The reading platform is in development.{" "}
            {collectionEnabled
              ? "This page collects interest ahead of onboarding."
              : "This page is a waitlist design prototype."}{" "}
            We have not announced a launch date.
          </p>
        </details>
        <details>
          <summary>Will there be comics and novels?</summary>
          <p>
            That’s the plan: original comics and serial novels, starting with a
            curated pilot. The first collection and supported formats will be
            confirmed as we test with creators and readers.
          </p>
        </details>
        <details>
          <summary>Will reading be free?</summary>
          <p>
            We’re exploring a free, advertising-supported starting experience,
            including optional rewarded access. The access model is still being
            tested and will be explained before launch.
          </p>
        </details>
        <details>
          <summary>Can I read offline?</summary>
          <p>
            Saved offline chapters are a planned feature. We’ll test download
            sizes, supported devices, and any access limits before confirming
            what will be available.
          </p>
        </details>
        <details>
          <summary>How will creators get paid?</summary>
          <p>
            We’re developing a revenue-sharing model. Joining the waitlist does
            not qualify someone for payment. The calculation, eligibility,
            payout threshold, and schedule will be published before monetised
            participation.
          </p>
        </details>
        <details>
          <summary>Can I submit my work yet?</summary>
          <p>
            This is a creator interest list, not a submission portal. Submission
            dates, requirements, and publishing agreements will be shared before
            the pilot opens.
          </p>
        </details>
        <details>
          <summary>Is this only for Nigerian creators?</summary>
          <p>
            Our first focus is Nigerian creators and readers, with a wider
            African and global ambition. Specific pilot eligibility will be
            announced when submissions open.
          </p>
        </details>
      </div>
    </section>
  );
}
