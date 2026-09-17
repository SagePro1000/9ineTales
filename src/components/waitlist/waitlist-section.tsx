import { WaitlistForm } from "./waitlist-form";

export function WaitlistSection() {
  return (
    <section
      className="waitlist-section"
      id="waitlist"
      aria-labelledby="waitlist-title"
    >
      <div className="wrap section-space waitlist-grid">
        <div>
          <p className="eyebrow">Be part of the first chapter</p>
          <h2 id="waitlist-title">
            Good stories
            <br />
            start with
            <br />
            <span>curiosity.</span>
          </h2>
          <p>
            Join for development updates and opportunities to help shape
            9inetales as a reader, a creator, or both.
          </p>
        </div>
        <div className="signup-panel">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
