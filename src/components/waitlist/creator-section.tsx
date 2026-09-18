import { AudienceLink } from "./waitlist-context";

export function CreatorSection() {
  return (
    <section
      className="creator-section"
      id="creators"
      aria-labelledby="creator-title"
    >
      <div className="wrap section-space creator-grid">
        <div>
          <p className="eyebrow">02 / For the creators</p>
          <h2 id="creator-title">
            You build the world.
            <br />
            Let’s help it find
            <br />
            its readers.
          </h2>
          <p className="creator-description">
            You bring the characters, the craft, and the imagination. We’re
            building a place where independent comic artists and writers can
            publish and grow an audience.
          </p>
          <AudienceLink className="button" role="creator">
            Join as a creator
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M5 15L15 5M5 5H15V15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </AudienceLink>
        </div>
        <div className="creator-details">
          <article>
            <h3>Your work, thoughtfully presented.</h3>
            <p>
              Submissions will be reviewed for rights, content requirements,
              readability, and suitability before publication.
            </p>
          </article>
          <article>
            <h3>A clear approach to earnings.</h3>
            <p>
              We’re exploring advertising-supported reading and creator revenue
              sharing. Final eligibility, rates, and payment terms will be
              published before monetised participation.
            </p>
          </article>
          <article>
            <h3>Know the terms before you commit.</h3>
            <p>
              Joining this list does not submit your work, grant us rights, or
              commit you to publishing. Creator agreements will be available to
              review before onboarding.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
