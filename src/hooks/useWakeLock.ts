"use client";

import { useEffect, useRef, useState } from "react";

export function useWakeLock() {
  const [isLocked, setIsLocked] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    setIsSupported("wakeLock" in navigator);

    if (!("wakeLock" in navigator)) return;

    let isMounted = true;

    async function requestWakeLock() {
      try {
        if (sentinelRef.current) return;
        const sentinel = await navigator.wakeLock.request("screen");
        if (!isMounted) {
          sentinel.release();
          return;
        }
        sentinelRef.current = sentinel;
        setIsLocked(true);

        sentinel.addEventListener("release", () => {
          sentinelRef.current = null;
          if (isMounted) setIsLocked(false);
        });
      } catch (err) {
        // May fail if battery saver is active or tab is not active
        console.warn("Screen Wake Lock request failed:", err);
      }
    }

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (sentinelRef.current) {
        sentinelRef.current.release().catch(() => {});
        sentinelRef.current = null;
      }
    };
  }, []);

  return { isSupported, isLocked };
}
