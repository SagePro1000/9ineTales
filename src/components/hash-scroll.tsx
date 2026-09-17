"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Position direct section links after local fonts finish loading. */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {
      if (!active || !window.location.hash) return;
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    });
    return () => {
      active = false;
    };
  }, [pathname]);

  return null;
}
