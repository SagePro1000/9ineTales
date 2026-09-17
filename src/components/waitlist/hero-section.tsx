import { AudienceLink } from "./waitlist-context";

export function HeroSection() {
  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">
          OUR STORIES.
          <br />
          <span>NEW WORLDS.</span>
        </h1>
        <p className="hero-description">
          A new home for original comics and serial novels by African creators.
          Starting in Nigeria. Made for the stories you can’t put down.
        </p>
        <div className="hero-actions">
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
          <AudienceLink className="text-action" role="reader">
            Join as a reader
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M4 10H16M11 5L16 10L11 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </AudienceLink>
        </div>
        <p className="release-note">
          <strong>Joining does not submit your work.</strong>
          <span>In development. Email registration is not active yet.</span>
        </p>
      </div>
      <figure className="hero-art hero-art--comic">
        <div className="art-frame">
          <img
            src="/assets/hero-comic-splash.jpeg"
            width="736"
            height="920"
            alt="Comic splash illustration of four young Black characters, with glowing symbols and swirling white energy."
            fetchPriority="high"
          />
          <div className="art-label">
            <span>IMAGINATION, ILLUSTRATED.</span>
            <span>Reference artwork. Not a confirmed 9inetales title.</span>
          </div>
        </div>
        <figcaption className="art-caption">
          Artwork: @mohammedawwall.
        </figcaption>
      </figure>
    </section>
  );
}
