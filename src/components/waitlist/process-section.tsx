export function ProcessSection() {
  return (
    <section
      className="process-section wrap section-space"
      aria-labelledby="process-title"
    >
      <div className="process-heading">
        <div>
          <p className="eyebrow">03 / The idea is simple</p>
          <h2 id="process-title">
            From imagination
            <br />
            to the next chapter.
          </h2>
        </div>
        <p>
          This is the publishing journey we’re developing. A small, curated
          pilot comes first.
        </p>
      </div>
      <ol className="process-list">
        <li>
          <span>01</span>
          <h3>Creators submit.</h3>
          <p>Share your work and the details we need to understand it.</p>
        </li>
        <li>
          <span>02</span>
          <h3>We review.</h3>
          <p>
            Check requirements, discuss revisions, and agree publication
            settings.
          </p>
        </li>
        <li>
          <span>03</span>
          <h3>Stories go live.</h3>
          <p>Approved chapters are published on an agreed schedule.</p>
        </li>
        <li>
          <span>04</span>
          <h3>Readers discover.</h3>
          <p>Explore, follow a story, and return for its next release.</p>
        </li>
      </ol>
    </section>
  );
}
