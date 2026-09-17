"use client";

import { useState } from "react";

const colours = [
  {
    name: "Signature orange",
    hex: "#FF5A1F",
    className: "orange-swatch",
    use: "Energy / brand / accents",
  },
  {
    name: "Deep ink",
    hex: "#211A17",
    className: "ink-swatch",
    use: "Text / structure / dark surfaces",
  },
  {
    name: "Warm paper",
    hex: "#FFF8F0",
    className: "paper-swatch",
    use: "Reading / primary surfaces",
  },
  {
    name: "Muted brown",
    hex: "#6B5E57",
    className: "muted-swatch",
    use: "Supporting text",
  },
  {
    name: "Dark orange",
    hex: "#C44012",
    className: "dark-orange-swatch",
    use: "Links / accessible filled actions",
  },
  {
    name: "White",
    hex: "#FFFFFF",
    className: "white-swatch",
    use: "Forms / clean surfaces",
  },
];

export function ColourPalette() {
  const [status, setStatus] = useState("Select a swatch to copy its colour.");

  async function copyColour(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setStatus(`${hex} copied.`);
    } catch {
      setStatus(
        `Copy this colour: ${hex}. Clipboard access is unavailable in this preview.`,
      );
    }
  }

  return (
    <>
      <div className="swatch-grid">
        {colours.map((colour) => (
          <button
            key={colour.hex}
            className={`swatch ${colour.className}`}
            data-colour={colour.hex}
            aria-label={`Copy ${colour.name}: ${colour.hex}`}
            onClick={() => copyColour(colour.hex)}
          >
            <span>{colour.name}</span>
            <strong>{colour.hex}</strong>
            <small>{colour.use}</small>
          </button>
        ))}
      </div>
      <p id="copy-status" className="kit-note" role="status">
        {status}
      </p>
    </>
  );
}
