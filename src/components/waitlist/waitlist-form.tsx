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

export function WaitlistForm() {
  const { resetVersion } = useWaitlist();
  // Only a completed preview is reset by an audience-specific CTA.
  return <FormFields key={resetVersion} />;
}

function FormFields() {
  const { role, setRole, setPreviewComplete } = useWaitlist();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [consentError, setConsentError] = useState("");
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
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

    // Prototype only: no fetch, API call, mailing-list integration, or browser storage.
    // Clear the email before showing the demonstration confirmation.
    setEmail("");
    setSubmittedRole(role);
    setPreviewComplete(true);
  }

  function resetSignup() {
    setSubmittedRole(null);
    setPreviewComplete(false);
    setEmail("");
    setConsent(false);
    setEmailError("");
    setConsentError("");
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
      >
        <fieldset>
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
        <button
          className="button signup-button"
          type="submit"
          disabled={!ready}
        >
          Preview my signup <span aria-hidden="true">↗</span>
        </button>
        <p id="form-note" className="form-note">
          Prototype only. Your email is not sent, saved, or added to a mailing
          list.
        </p>
        <noscript>
          <p className="form-note">
            Enable JavaScript to try the signup preview.
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
        <h3>Your first chapter starts here.</h3>
        <p id="signup-message">
          {submittedRole ? messages[submittedRole] : ""}
        </p>
        <p className="form-note">
          This is the confirmation design. No signup was saved and no email will
          be sent.
        </p>
        {submittedRole ? (
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
          Try another signup <span aria-hidden="true">→</span>
        </button>
      </div>
    </>
  );
}
