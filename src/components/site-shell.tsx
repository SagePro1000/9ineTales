import Link from "next/link";

type Mode = "waitlist" | "brand" | "privacy";

export function SkipLink() {
  return (
    <a className="skip-link" href="#main">
      Skip to content
    </a>
  );
}

export function PreviewBar({ mode = "waitlist" }: { mode?: Mode }) {
  return (
    <div className="preview-bar">
      {mode === "brand" ? (
        <>
          <span>Working identity / version 0.1</span>
          <Link href="/">Open the waitlist preview ↗</Link>
        </>
      ) : (
        <>
          <span>
            Design preview{" "}
            <span className="preview-detail">
              — signups are demonstrated, not collected.
            </span>
          </span>
          <Link href="/brand-kit/">
            Explore the brand kit <span aria-hidden="true">↗</span>
          </Link>
        </>
      )}
    </div>
  );
}

export function SiteHeader({ mode = "waitlist" }: { mode?: Mode }) {
  return (
    <header className="site-header wrap">
      <Link className="brand-link" href="/" aria-label="9inetales home">
        <img
          src="/assets/logos/horizontal.svg"
          width={196}
          height={48}
          alt="9inetales"
        />
      </Link>
      {mode === "privacy" ? (
        <Link className="text-action" href="/">
          Back to the preview →
        </Link>
      ) : (
        <>
          <nav
            aria-label={mode === "brand" ? "Brand guide" : "Main navigation"}
          >
            {mode === "brand" ? (
              <>
                <a href="#identity">Identity</a>
                <a href="#colour">Colour</a>
                <a href="#type">Type</a>
                <a href="#mobile">Mobile</a>
              </>
            ) : (
              <>
                <a href="#readers">For readers</a>
                <a href="#creators">For creators</a>
                <a href="#questions">FAQs</a>
              </>
            )}
          </nav>
          {mode === "brand" ? (
            <a
              className="button button-small"
              href="/assets/9inetales-brand-kit.zip"
              download
            >
              Download kit ↗
            </a>
          ) : (
            <a className="button button-small" href="#waitlist">
              Join the waitlist <span aria-hidden="true">↗</span>
            </a>
          )}
        </>
      )}
    </header>
  );
}

export function SiteFooter({ mode = "waitlist" }: { mode?: Mode }) {
  return (
    <footer className="site-footer wrap">
      <Link className="brand-link" href="/" aria-label="9inetales home">
        <img
          src="/assets/logos/horizontal.svg"
          width={180}
          height={44}
          alt="9inetales"
        />
      </Link>
      <p>Original voices. A world of possibility.</p>
      <div>
        {mode === "brand" ? <Link href="/">Waitlist preview</Link> : null}
        <Link href="/privacy/">Privacy &amp; prototype</Link>
        {mode !== "brand" ? <Link href="/brand-kit/">Brand kit</Link> : null}
      </div>
      <small>
        {mode === "brand"
          ? "9inetales / Working brand kit / Version 0.1"
          : "© 2026 9inetales. In development."}
      </small>
    </footer>
  );
}
