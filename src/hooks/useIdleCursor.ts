"use client";

import { useEffect, useRef, useState } from "react";

export function useIdleCursor(timeoutMs: number = 3000) {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      setIsIdle(false);
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, timeoutMs);
    };

    const events = ["mousemove", "mousedown", "touchstart", "touchmove", "keydown"];
    events.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }));

    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((evt) => window.removeEventListener(evt, resetTimer));
    };
  }, [timeoutMs]);

  return { isIdle };
}
