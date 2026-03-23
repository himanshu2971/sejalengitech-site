import { useState, useEffect } from "react";

/**
 * Hook: formats an ISO date string in the user's browser timezone.
 * Returns null on the server (avoids hydration mismatch), then
 * updates to the correct local time after mount.
 *
 * Usage: const formatted = useLocalDate(session.scheduled_at);
 *        display: formatted ?? new Date(iso).toLocaleString()
 */
export function useLocalDate(isoString) {
  const [formatted, setFormatted] = useState(null);
  useEffect(() => {
    if (!isoString) return;
    setFormatted(
      new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month:   "short",
        day:     "numeric",
        year:    "numeric",
        hour:    "2-digit",
        minute:  "2-digit",
        timeZoneName: "short", // shows "IST", "AEST", "EST" automatically
      }).format(new Date(isoString))
    );
  }, [isoString]);
  return formatted;
}

// Static approximate rates — update periodically (₹1 ≈ these units)
const APPROX_RATES = { USD: 0.012, AUD: 0.019, EUR: 0.011, GBP: 0.0095 };

/**
 * Hook: returns a price string showing INR as primary and a secondary
 * currency approximation for non-Indian browser locales.
 *
 * Examples:
 *   en-IN  →  "₹4,999"
 *   en-AU  →  "₹4,999 (~A$95)"
 *   en-US  →  "₹4,999 (~$60)"
 *   en-GB  →  "₹4,999 (~£47)"
 *
 * Returns null until hydrated (safe for SSR pages).
 */
export function usePriceDisplay(amount) {
  const [display, setDisplay] = useState(null);
  useEffect(() => {
    if (!amount || amount === 0) { setDisplay("Free"); return; }
    const primary = new Intl.NumberFormat("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 0,
    }).format(amount);

    const locale = navigator.language ?? "en-IN";
    let secondary = null;
    if (locale.includes("en-AU"))         secondary = { code: "AUD", rate: APPROX_RATES.AUD };
    else if (locale.startsWith("en-US"))  secondary = { code: "USD", rate: APPROX_RATES.USD };
    else if (locale.startsWith("en-GB"))  secondary = { code: "GBP", rate: APPROX_RATES.GBP };
    else if (locale.startsWith("en-EU") || locale.startsWith("de") || locale.startsWith("fr"))
                                          secondary = { code: "EUR", rate: APPROX_RATES.EUR };

    if (!secondary) { setDisplay(primary); return; }
    const approx = new Intl.NumberFormat(locale, {
      style: "currency", currency: secondary.code, maximumFractionDigits: 0,
    }).format(amount * secondary.rate);
    setDisplay(`${primary} (~${approx})`);
  }, [amount]);
  return display;
}
