import type { Metadata } from "next";
import type { ReactNode } from "react";
import { HashScroll } from "@/components/hash-scroll";
import "@/styles/fonts.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "9inetales — Our stories. New worlds.",
    template: "%s | 9inetales",
  },
  description:
    "An upcoming home for original comics and serial novels by African creators, starting in Nigeria. Discover the 9inetales reader and creator waitlist.",
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
