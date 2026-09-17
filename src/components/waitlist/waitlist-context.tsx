"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type AudienceRole = "reader" | "creator" | "both";

type WaitlistContextValue = {
  role: AudienceRole;
  setRole: (role: AudienceRole) => void;
  chooseRole: (role: AudienceRole) => void;
  resetVersion: number;
  setPreviewComplete: (complete: boolean) => void;
};

const WaitlistContext = createContext<WaitlistContextValue | null>(null);

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<AudienceRole>("reader");
  const [resetVersion, setResetVersion] = useState(0);
  const [previewComplete, setPreviewComplete] = useState(false);

  function chooseRole(nextRole: AudienceRole) {
    setRole(nextRole);
    if (previewComplete) {
      setResetVersion((version) => version + 1);
      setPreviewComplete(false);
    }
  }

  return (
    <WaitlistContext.Provider
      value={{ role, setRole, chooseRole, resetVersion, setPreviewComplete }}
    >
      {children}
    </WaitlistContext.Provider>
  );
}

export function useWaitlist() {
  const context = useContext(WaitlistContext);
  if (!context)
    throw new Error("Waitlist controls must be inside WaitlistProvider.");
  return context;
}

/** Preselect the audience while preserving an unfinished signup. */
export function AudienceLink({
  role,
  className,
  children,
}: {
  role: AudienceRole;
  className?: string;
  children: ReactNode;
}) {
  const { chooseRole } = useWaitlist();
  return (
    <a
      href="#waitlist"
      className={className}
      data-role-target={role}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        chooseRole(role);
      }}
    >
      {children}
    </a>
  );
}
