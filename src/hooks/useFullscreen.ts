"use client";

import { useCallback, useEffect, useState } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateFullscreenStatus = () => {
      // Cross-browser vendor prefixes for older Edge/Chrome/kiosk smartboard browsers
      const doc = document as any;
      const fsElement =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement;
      setIsFullscreen(Boolean(fsElement));
    };

    updateFullscreenStatus();
    document.addEventListener("fullscreenchange", updateFullscreenStatus);
    document.addEventListener("webkitfullscreenchange", updateFullscreenStatus);
    document.addEventListener("mozfullscreenchange", updateFullscreenStatus);
    document.addEventListener("MSFullscreenChange", updateFullscreenStatus);

    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreenStatus);
      document.removeEventListener("webkitfullscreenchange", updateFullscreenStatus);
      document.removeEventListener("mozfullscreenchange", updateFullscreenStatus);
      document.removeEventListener("MSFullscreenChange", updateFullscreenStatus);
    };
  }, []);

  const enterFullscreen = useCallback(async () => {
    try {
      const doc = document as any;
      const el = document.documentElement as any;
      const fsElement =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement;

      if (!fsElement) {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          await el.webkitRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
          await el.mozRequestFullScreen();
        } else if (el.msRequestFullscreen) {
          await el.msRequestFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen request error:", err);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      const doc = document as any;
      const fsElement =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement;

      if (fsElement) {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen exit error:", err);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const doc = document as any;
    const fsElement =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement;

    if (fsElement) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  return { isFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen };
}
