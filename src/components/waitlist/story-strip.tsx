"use client";

import { useState } from "react";

const phrases = [
  "Comics",
  "Serial novels",
  "African creators",
  "New voices",
  "Worlds to discover",
  "Endless possibility",
];

export function StoryStrip() {
  const [paused, setPaused] = useState(false);
  return (
    <section className="story-strip" aria-label="The world of 9inetales">
      <p className="visually-hidden">{phrases.join(". ")}.</p>
      <div className="story-strip-viewport">
        <div className={`story-strip-track${paused ? " is-paused" : ""}`}>
          {[0, 1].map((copy) => (
            <div className="story-strip-group" aria-hidden="true" key={copy}>
              {phrases.map((phrase) => (
                <div className="story-strip-item" key={phrase}>
                  <span>{phrase}</span>
                  <span className="strip-star">✳</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="story-strip-toggle"
        aria-label={paused ? "Resume story strip" : "Pause story strip"}
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          {paused ? (
            <path d="M4 2L13 8L4 14Z" fill="currentColor" />
          ) : (
            <path d="M4 2V14M12 2V14" stroke="currentColor" strokeWidth="3" />
          )}
        </svg>
      </button>
    </section>
  );
}
