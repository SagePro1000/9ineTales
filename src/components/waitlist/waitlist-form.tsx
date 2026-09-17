"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useWaitlist, type AudienceRole } from "./waitlist-context";

const messages: Record<AudienceRole, string> = {
  reader:
    "As a reader, you would receive development updates and opportunities to try the reading experience early.",
  creator:
    "As a creator, you would receive pilot updates and submission information when onboarding opens.",
  both: "You would receive reader updates, early testing opportunities, and creator pilot information.",
};

export function WaitlistForm({
  collectionEnabled = false,
}: {
  collectionEnabled?: boolean;
}) {
  const { resetVersion } = useWaitlist();
  // Only a completed preview is reset by an audience-specific CTA.
  return (
    <FormFields key={resetVersion} collectionEnabled={collectionEnabled} />
  );
}

function FormFields({ collectionEnabled }: { collectionEnabled: boolean }) {
  const { role, setRole, setPreviewComplete } = useWaitlist();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [consentError, setConsentError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [website, setWebsite] = useState("");
  const submittingRef = useRef(false);
  const [submittedRole, setSubmittedRole] = useState<AudienceRole | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (submittedRole) resultRef.current?.focus();
  }, [submittedRole]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || submittingRef.current) return;
    setSubmitError("");
    const trimmed = email.trim();
    const input = emailRef.current;
    if (!input) return;
    setEmail(trimmed);
    const emailValid = trimmed.length > 0 && input.validity.valid;
    setEmailError(
      emailValid ? "" : "Enter a valid email address, such as you@example.com.",
    );
    setConsentError(
      consent
        ? ""
        : "Please confirm you’d like development and early-access emails.",
    );
    if (!emailValid) {
      input.focus();
      return;
    }
    if (!consent) {
      consentRef.current?.focus();
      return;
    }

    const signupRole = role;
    if (collectionEnabled) {
      submittingRef.current = true;
      setSubmitting(true);
      try {
        const source = new URLSearchParams(window.location.search).get(
          "utm_source",
        );
        const response = await fetch("/api/waitlist/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: trimmed,
            role: signupRole,
            consent,
            website,
            ...(source && /^[a-z0-9_-]{1,64}$/i.test(source) ? { source } : {}),
          }),
          signal: AbortSignal.timeout(30000),
        });
        const result = await response.json();
        if (!response.ok || result.status !== "pending") {
          setSubmitError(
            typeof result.message === "string"
              ? result.message
              : "We couldn’t complete your signup. Please try again.",
          );
          return;
        }
      } catch {
        setSubmitError(
          "We couldn’t reach the signup service. Your details are still here. Check your connection and try again.",
        );
        return;
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    }
    // The disabled mode remains a preview and never contacts the signup endpoint.
    setEmail("");
    setSubmittedRole(signupRole);
    setPreviewComplete(true);
  }

  function resetSignup() {
    setSubmittedRole(null);
    setPreviewComplete(false);
    setEmail("");
    setConsent(false);
    setEmailError("");
    setConsentError("");
    setSubmitError("");
    setRole("reader");
    requestAnimationFrame(() => emailRef.current?.focus());
  }

  return (
    <>
      <form
        id="waitlist-form"
        noValidate
        hidden={submittedRole !== null}
        onSubmit={handleSubmit}
        aria-busy={submitting}
      >
        <fieldset disabled={submitting}>
          <legend>I’m joining as a…</legend>
          <div className="role-options">
            {(["reader", "creator", "both"] as const).map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="role"
                  value={option}
                  checked={role === option}
                  onChange={() => setRole(option)}
                />
                <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="field-label" htmlFor="email">
          Email address
        </label>
        <input
          ref={emailRef}
          id="email"
          name={ready ? "email" : undefined}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          maxLength={254}
          disabled={submitting}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (event.target.value.trim() && event.target.validity.valid) {
              setEmailError("");
            }
          }}
          aria-invalid={emailError ? true : undefined}
          aria-describedby="email-error form-note"
        />
        <p id="email-error" className="field-error" aria-live="polite">
          {emailError}
        </p>
        <label className="consent-label">
          <input
            ref={consentRef}
            type="checkbox"
            id="consent"
            required
            disabled={submitting}
            checked={consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              if (event.target.checked) setConsentError("");
            }}
            aria-invalid={consentError ? true : undefined}
            aria-describedby="consent-error"
          />
          <span>
            I’d like 9inetales development and early-access emails. I can
            unsubscribe at any time.
          </span>
        </label>
        <p id="consent-error" className="field-error" aria-live="polite">
          {consentError}
        </p>
        {collectionEnabled ? (
          <div className="signup-bot-trap" aria-hidden="true">
            <label htmlFor="signup-website">Leave this field empty</label>
            <input
              id="signup-website"
              type="text"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
        ) : null}
        <p id="submit-error" className="field-error" role="alert">
          {submitError}
        </p>
        <button
          className="button signup-button"
          type="submit"
          disabled={!ready || submitting}
          aria-describedby="form-note submit-error"
        >
          {submitting
            ? "Requesting confirmation…"
            : collectionEnabled
              ? "Join the waitlist"
              : "Preview my signup"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
        <p id="form-note" className="form-note">
          {collectionEnabled ? (
            <>
              Confirm your email before receiving updates. Read our{" "}
              <a href="/privacy/">waitlist privacy notice</a>.
            </>
          ) : (
            "Prototype only. Your email is not sent, saved, or added to a mailing list."
          )}
        </p>
        <noscript>
          <p className="form-note">
            {collectionEnabled
              ? "Enable JavaScript to join the waitlist."
              : "Enable JavaScript to try the signup preview."}
          </p>
        </noscript>
      </form>
      <div
        ref={resultRef}
        id="signup-result"
        hidden={submittedRole === null}
        role="status"
        tabIndex={-1}
      >
        <span className="success-mark" aria-hidden="true">
          ✓
        </span>
        <h3>
          {collectionEnabled
            ? "Check your inbox to confirm."
            : "Your first chapter starts here."}
        </h3>
        <p id="signup-message">
          {collectionEnabled
            ? "For a new, eligible email address, we request a confirmation email. Click its link to join the waitlist, and check spam if it hasn’t arrived."
            : submittedRole
              ? messages[submittedRole]
              : ""}
        </p>
        <p className="form-note">
          {collectionEnabled
            ? "Already subscribed or previously unsubscribed? This form won’t change your existing preferences or subscription. Repeat requests may not send another email."
            : "This is the confirmation design. No signup was saved and no email will be sent."}
        </p>
        {submittedRole && !collectionEnabled ? (
          <details className="optional-question">
            <summary>One optional question</summary>
            <label className="field-label" htmlFor="format-interest">
              What would you like to explore?
            </label>
            <select id="format-interest" defaultValue="Comics and novels">
              <option>Comics and novels</option>
              <option>Comics</option>
              <option>Serial novels</option>
            </select>
            <p className="form-note">
              Demonstration only; this answer is not collected.
            </p>
          </details>
        ) : null}
        <button
          className="text-action"
          type="button"
          id="reset-signup"
          onClick={resetSignup}
        >
          {collectionEnabled ? "Use another email" : "Try another signup"}{" "}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </>
  );
}
