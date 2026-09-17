import { AudienceLink } from "./waitlist-context";

export function ReaderSection() {
  return (
    <section
      className="reader-section wrap section-space"
      id="readers"
      aria-labelledby="reader-title"
    >
      <div className="section-intro">
        <p className="eyebrow">01 / For the readers</p>
        <h2 id="reader-title">
          Your next obsession
          <br />
          could start here.
        </h2>
        <p>
          Discover new voices, follow characters you care about, and come back
          for the next chapter.
        </p>
        <AudienceLink className="text-action" role="reader">
          Join as a reader <span aria-hidden="true">→</span>
        </AudienceLink>
      </div>
      <div className="feature-list">
        <article>
          <span className="feature-number">01</span>
          <div>
            <h3>Stories closer to home.</h3>
            <p>
              Comics and serial novels from African creators, with Nigerian
              voices at the heart of our first collection.
            </p>
          </div>
        </article>
        <article>
          <span className="feature-number">02</span>
          <div>
            <h3>A chapter at a time.</h3>
            <p>
              Discover a story, get drawn into its world, and follow along as
              new chapters are released.
            </p>
          </div>
        </article>
        <article>
          <span className="feature-number">03</span>
          <div>
            <h3>Built around your connection.</h3>
            <p>
              We’re designing for comfortable mobile reading, smaller downloads,
              and saved chapters you can read offline.
            </p>
            <span className="status-label">Planned for testing</span>
          </div>
        </article>
      </div>
    </section>
  );
}
