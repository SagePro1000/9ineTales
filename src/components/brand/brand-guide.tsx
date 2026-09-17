import { ColourPalette } from "./colour-palette";

export function BrandGuide() {
  return (
    <main id="main">
      <section className="kit-hero wrap">
        <div>
          <p className="eyebrow">9inetales / Brand foundations</p>
          <h1>
            THE VOICE.
            <br />
            THE WORLD.
            <br />
            <span>THE LOOK.</span>
          </h1>
          <p>
            A confident, warm identity for Nigerian stories with room to travel.
            Expressive where we invite imagination. Clear where we explain,
            read, and build trust.
          </p>
          <div className="kit-tags">
            <span>Nigerian first</span>
            <span>Creator conscious</span>
            <span>Story driven</span>
          </div>
        </div>
        <div className="identity-poster">
          <img
            src="/assets/logos/primary.svg"
            width="560"
            height="408"
            alt="Refined 9inetales stacked speech-bubble logo"
          />
          <span>
            ORIGINAL VOICES.
            <br />A WORLD OF POSSIBILITY.
          </span>
          <small>Vector redraw study / flat colour</small>
        </div>
      </section>
      <section className="kit-section wrap" id="identity">
        <div className="kit-section-heading">
          <p className="eyebrow">01 / The identity</p>
          <h2>
            One idea.
            <br />
            Room to adapt.
          </h2>
          <p>
            Keep the speech bubble, bold lettering, and spark from your
            original. Simplify the construction and give each placement a
            version that fits.
          </p>
        </div>
        <div className="logo-grid">
          <article className="logo-example">
            <div className="logo-surface">
              <img
                src="/assets/logos/primary.svg"
                alt="Primary stacked logo"
                width="560"
                height="408"
              />
            </div>
            <div className="example-caption">
              <div>
                <h3>The expressive signature</h3>
                <p>Campaigns, posters, and spacious placements.</p>
              </div>
              <a href="/assets/logos/primary.svg" download>
                SVG ↗
              </a>
            </div>
          </article>
          <article className="logo-example">
            <div className="logo-surface horizontal-surface">
              <img
                src="/assets/logos/horizontal.svg"
                alt="Horizontal logo"
                width="560"
                height="118"
              />
            </div>
            <div className="example-caption">
              <div>
                <h3>The everyday wordmark</h3>
                <p>Headers, emails, and narrow spaces.</p>
              </div>
              <a href="/assets/logos/horizontal.svg" download>
                SVG ↗
              </a>
            </div>
          </article>
          <article className="logo-example">
            <div className="logo-surface symbol-surface">
              <img
                src="/assets/logos/symbol.svg"
                alt="Simplified speech bubble with numeral nine"
                width="96"
                height="96"
              />
              <div className="symbol-size-tests">
                <img
                  src="/assets/logos/symbol.svg"
                  width="48"
                  height="48"
                  alt="Symbol at 48 pixels"
                />
                <img
                  src="/assets/logos/symbol.svg"
                  width="32"
                  height="32"
                  alt="Symbol at 32 pixels"
                />
                <img
                  src="/assets/logos/symbol.svg"
                  width="16"
                  height="16"
                  alt="Symbol at 16 pixels"
                />
              </div>
            </div>
            <div className="example-caption">
              <div>
                <h3>The compact symbol</h3>
                <p>Profile images, icons, and favicons.</p>
              </div>
              <a href="/assets/logos/symbol.svg" download>
                SVG ↗
              </a>
            </div>
          </article>
          <article className="logo-example">
            <div className="logo-surface reverse-surface">
              <img
                src="/assets/logos/primary-reversed.svg"
                alt="Single-colour light stacked logo on deep ink"
                width="560"
                height="408"
              />
            </div>
            <div className="example-caption">
              <div>
                <h3>One colour, still recognisable</h3>
                <p>Dark surfaces and simple reproduction.</p>
              </div>
              <a href="/assets/logos/primary-reversed.svg" download>
                SVG ↗
              </a>
            </div>
          </article>
        </div>
        <div className="rule-grid">
          <article>
            <h3>Give it space.</h3>
            <p>
              Keep clear space of at least one quarter of the symbol height
              around each logo. Increase it beside artwork and busy headlines.
            </p>
          </article>
          <article>
            <h3>Choose the right size.</h3>
            <p>
              Start at 160px wide for the stacked logo and 140px for the
              horizontal wordmark. Use the symbol at smaller sizes.
            </p>
          </article>
          <article>
            <h3>Keep the shape intact.</h3>
            <p>
              No stretching, gradients, extra shadows inside the logo, or
              placement over busy art. Use approved flat-colour exports.
            </p>
          </article>
        </div>
        <p className="kit-note">
          These are proposed redraws, not exact vector traces of your original
          lettering. The original PNG is preserved in the downloadable kit.
          Final selection and name clearance remain pending.
        </p>
      </section>
      <section className="kit-section wrap" id="colour">
        <div className="kit-section-heading">
          <p className="eyebrow">02 / Colour</p>
          <h2>
            Orange brings the spark.
            <br />
            Ink gives it structure.
          </h2>
          <p>
            Neutral surfaces make room for varied creator artwork. Use orange
            with intention, not as the background of every screen.
          </p>
        </div>
        <ColourPalette />
        <div className="contrast-grid">
          <article>
            <div className="contrast-sample sample-orange">
              Start your next chapter ↗
            </div>
            <h3>Ink on orange</h3>
            <p>5.50:1 calculated contrast. Preferred for signature buttons.</p>
          </article>
          <article>
            <div className="contrast-sample sample-dark-orange">
              Start your next chapter ↗
            </div>
            <h3>White on dark orange</h3>
            <p>
              5.14:1 calculated contrast. An alternative for filled actions.
            </p>
          </article>
          <article>
            <div className="contrast-sample sample-paper">
              The story continues.
            </div>
            <h3>Ink on paper</h3>
            <p>
              16.28:1 calculated contrast. Preferred for comfortable body text.
            </p>
          </article>
        </div>
        <p className="kit-note">
          White on signature orange is 3.12:1: avoid it for normal-size text.
          Status colours are separate: success #236343 and error #A52A24. Always
          include words or symbols rather than relying on colour alone.
        </p>
      </section>
      <section className="kit-section type-section" id="type">
        <div className="wrap">
          <div className="kit-section-heading">
            <p className="eyebrow">03 / Typography</p>
            <h2>
              Loud enough to invite.
              <br />
              Quiet enough to read.
            </h2>
          </div>
          <div className="type-grid">
            <article>
              <div className="type-label">
                DISPLAY / BARLOW CONDENSED / 700–800
              </div>
              <p className="display-specimen">
                A WORLD
                <br />
                WAITING
                <br />
                TO BE READ.
              </p>
              <p className="type-alphabet display-alphabet">
                Aa Bb Cc Dd Ee Ff Gg
                <br />
                0123456789 &amp; ! ?
              </p>
              <p className="kit-note">
                Short campaign headlines and section titles. Sentence case for
                most section headings; uppercase for expressive campaigns.
              </p>
            </article>
            <article>
              <div className="type-label">
                BODY / SOURCE SANS 3 / 400, 600, 700
              </div>
              <p className="body-specimen">
                Every world begins
                <br />
                with a voice.
              </p>
              <p className="reading-specimen">
                A character you recognise. A place you’ve never been. A question
                that keeps you turning the page. Give the story space, and let
                the reader settle in.
              </p>
              <p className="type-alphabet">
                Aa Bb Cc Dd Ee Ff Gg
                <br />
                0123456789 &amp; ! ?<br />
                Ọlá · Èkó · Chidịmma
              </p>
              <p className="kit-note">
                Body copy at 16–20px with 1.5–1.65 line height. Forms and
                navigation at 16px. Secondary notes at 14px where practical.
                Never use condensed display type for novel chapters.
              </p>
            </article>
          </div>
          <div className="scale-row">
            <span>
              <strong>Display</strong>56–116px
            </span>
            <span>
              <strong>Section</strong>44–78px
            </span>
            <span>
              <strong>Subheading</strong>20–24px
            </span>
            <span>
              <strong>Body</strong>16–20px
            </span>
            <span>
              <strong>Spacing</strong>4 / 8 / 16 / 24 / 32 / 48
            </span>
          </div>
          <p className="kit-note">
            Fonts are served locally. Sizes adapt to the viewport and respect
            text enlargement. Test language coverage with real creator material
            before committing to a reader font.
          </p>
        </div>
      </section>
      <section className="kit-section wrap" id="imagery">
        <div className="kit-section-heading">
          <p className="eyebrow">04 / Imagery &amp; voice</p>
          <h2>
            The stories bring
            <br />
            their own colour.
          </h2>
          <p>
            The identity frames creator work. It should never force every comic
            or novel into the same visual style.
          </p>
        </div>
        <div className="imagery-grid">
          <figure className="imagery-example">
            <img
              src="/assets/hero-comic-splash.jpeg"
              width="736"
              height="920"
              alt="Comic splash illustration of four young Black characters with glowing symbols and swirling white energy"
            />
            <figcaption>
              Artwork: @mohammedawwall / preview reference.
            </figcaption>
          </figure>
          <div className="imagery-rules">
            <article>
              <h3>Put creators in the picture.</h3>
              <p>
                Use permissioned panels, covers, and excerpts with creator
                credits and agreed usage. Keep lettering legible; don’t crop
                important story content.
              </p>
            </article>
            <article>
              <h3>Be specific about culture.</h3>
              <p>
                Draw on the story’s actual places, characters, and references.
                Avoid interchangeable cultural symbols or claims about mythology
                that the work does not support.
              </p>
            </article>
            <article>
              <h3>Keep reference artwork honest.</h3>
              <p>
                This supplied illustration is a visual reference for the
                prototype, not a confirmed catalogue title or creator
                partnership. Use commissioned or licensed artwork for launch,
                with agreed credits. Label any AI-generated concepts explicitly.
              </p>
            </article>
            <article>
              <h3>Speak plainly, with imagination.</h3>
              <p>
                Reader copy invites curiosity. Creator copy explains
                requirements and terms. Say “planned” when something is planned,
                and use concrete language around money and rights.
              </p>
            </article>
          </div>
        </div>
        <div className="voice-examples">
          <article>
            <span className="type-label">READER VOICE</span>
            <p>“Your next obsession could start here.”</p>
            <small>Inviting and story focused.</small>
          </article>
          <article>
            <span className="type-label">CREATOR VOICE</span>
            <p>“Know the terms before you commit.”</p>
            <small>Specific and respectful.</small>
          </article>
          <article>
            <span className="type-label">FEATURE STATUS</span>
            <p>“Saved offline chapters are a planned feature.”</p>
            <small>Honest about what exists today.</small>
          </article>
        </div>
      </section>
      <section className="kit-section mobile-section" id="mobile">
        <div className="wrap">
          <div className="kit-section-heading">
            <p className="eyebrow">05 / The mobile experience</p>
            <h2>
              Made for the screen
              <br />
              in your hand.
            </h2>
            <p>
              These are live, narrow-screen views of the actual prototype.
              Scroll inside them to explore the layout and try the signup
              states.
            </p>
          </div>
          <div className="phone-grid">
            <article>
              <div className="phone-frame">
                <div className="phone-top">
                  <span>9inetales / opening</span>
                </div>
                <iframe
                  src="/"
                  title="Mobile waitlist opening layout"
                  loading="lazy"
                />
              </div>
              <p className="kit-note">
                Opening: clear proposition, status, and two audience routes.
              </p>
            </article>
            <article>
              <div className="phone-frame">
                <div className="phone-top">
                  <span>9inetales / signup</span>
                </div>
                <iframe
                  src="/#waitlist"
                  title="Mobile waitlist signup layout"
                  loading="lazy"
                />
              </div>
              <p className="kit-note">
                Signup: role selection, email, consent, and an honest
                confirmation.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="kit-section wrap">
        <div className="kit-section-heading">
          <p className="eyebrow">06 / Reusable foundations</p>
          <h2>
            Keep the decisions.
            <br />
            Refine the execution.
          </h2>
          <p>
            The downloadable kit includes vector logos, fonts, design tokens,
            imagery rules, review-ready copy, and the checks needed before a
            real waitlist launches.
          </p>
        </div>
        <div className="component-row">
          <a className="button" href="/#waitlist">
            Primary action ↗
          </a>
          <a className="text-action" href="/">
            Secondary action →
          </a>
          <span className="status-label">Planned for testing</span>
        </div>
        <div className="rule-grid">
          <article>
            <h3>Sharp, simple structure.</h3>
            <p>
              2px corners, ink borders, and occasional offset shadows for
              primary invitations. Keep reading and explanation surfaces
              quieter.
            </p>
          </article>
          <article>
            <h3>Useful motion only.</h3>
            <p>
              Small hover responses and smooth anchor navigation. Respect
              reduced-motion settings. No animation should delay reading or
              signup.
            </p>
          </article>
          <article>
            <h3>One source of truth.</h3>
            <p>
              Reuse tokens and established components. Critique specific
              problems, preserve good decisions, and record deliberate changes.
            </p>
          </article>
        </div>
        <a className="button" href="/assets/9inetales-brand-kit.zip" download>
          Download the brand kit ↗
        </a>
        <p className="kit-note">
          Review draft / September 2026. Commercial terms, launch timing, and
          final identity approval remain open.
        </p>
      </section>
    </main>
  );
}
