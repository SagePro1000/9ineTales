import { AudienceLink } from "./waitlist-context";

export function HeroSection() {
  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="small-rule"></span>Nigerian voices. Boundless
          imagination.
        </p>
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
          <AudienceLink className="button" role="reader">
            Find your next story <span aria-hidden="true">↗</span>
          </AudienceLink>
          <a className="text-action" href="#creators">
            Bring your story <span aria-hidden="true">→</span>
          </a>
        </div>
        <p className="release-note">
          In development. Join the waitlist for updates and early testing
          opportunities.
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
