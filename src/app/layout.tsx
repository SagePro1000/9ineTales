import type { Metadata } from "next";
import type { ReactNode } from "react";
import { HashScroll } from "@/components/hash-scroll";
import "@/styles/fonts.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import "@/styles/brand.css";

export const metadata: Metadata = {
  title: {
    default: "9inetales — Our stories. New worlds.",
    template: "%s | 9inetales",
  },
  description:
    "An upcoming home for original comics and serial novels by African creators, starting in Nigeria. Explore the 9inetales waitlist design prototype.",
  robots: { index: false, follow: false },
  icons: { icon: "/assets/logos/symbol.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HashScroll />
        {children}
      </body>
    </html>
  );
}
