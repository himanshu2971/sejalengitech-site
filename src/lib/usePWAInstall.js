import { useState, useEffect, useRef } from "react";

const DISMISS_KEY = "pwa_install_dismissed_until";
const DISMISS_DAYS = 7;

export default function usePWAInstall() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const promptRef = useRef(null);

  useEffect(() => {
    // Already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check dismiss cooldown
    const dismissedUntil = localStorage.getItem(DISMISS_KEY);
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
      setIsDismissed(true);
    }

    const handler = (e) => {
      e.preventDefault();
      promptRef.current = e;
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setCanInstall(false);
      promptRef.current = null;
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (!promptRef.current) return false;
    promptRef.current.prompt();
    const { outcome } = await promptRef.current.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setCanInstall(false);
      promptRef.current = null;
      return true;
    }
    return false;
  }

  function dismiss() {
    const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(until));
    setIsDismissed(true);
  }

  return { canInstall, isInstalled, isDismissed, install, dismiss };
}
