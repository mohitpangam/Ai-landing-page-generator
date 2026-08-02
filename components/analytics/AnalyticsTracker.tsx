"use client";

import { useEffect, useRef } from "react";

interface AnalyticsTrackerProps {
  projectId: string;
}

export function AnalyticsTracker({ projectId }: AnalyticsTrackerProps) {
  const trackedView = useRef(false);

  useEffect(() => {
    if (!projectId || trackedView.current) return;
    trackedView.current = true;

    // Track Page View
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, eventType: "view" }),
    }).catch(console.error);

    // Track CTA Clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const clickable = target?.closest("a, button");
      if (clickable) {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId, eventType: "click" }),
        }).catch(console.error);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [projectId]);

  return null;
}
