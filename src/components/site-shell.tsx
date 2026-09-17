import Link from "next/link";

type Mode = "waitlist" | "privacy";

export function SkipLink() {
  return (
    <a className="skip-link" href="#main">
      Skip to content
    </a>
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
          Back to the waitlist →
        </Link>
      ) : (
        <>
          <nav aria-label="Main navigation">
            <a href="#readers">For readers</a>
            <a href="#creators">For creators</a>
            <a href="#questions">FAQs</a>
          </nav>
          <a className="button button-small" href="#waitlist">
            Join the waitlist <span aria-hidden="true">↗</span>
          </a>
        </>
      )}
    </header>
  );
}

export function SiteFooter() {
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
        <Link href="/privacy/">Privacy</Link>
      </div>
      <small>© 2026 9inetales. In development.</small>
    </footer>
  );
}
