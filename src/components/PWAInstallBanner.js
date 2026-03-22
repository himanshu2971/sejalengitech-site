import { useState, useEffect } from "react";
import usePWAInstall from "@/lib/usePWAInstall";

export default function PWAInstallBanner({ appName = "Alambana EduTech", delayMs = 4000 }) {
  const { canInstall, isInstalled, isDismissed, install, dismiss } = usePWAInstall();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!canInstall || isInstalled || isDismissed) return;
    const t = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(t);
  }, [canInstall, isInstalled, isDismissed, delayMs]);

  if (!visible || isInstalled || isDismissed) return null;

  async function handleInstall() {
    const accepted = await install();
    if (accepted) setVisible(false);
  }

  function handleDismiss() {
    dismiss();
    setVisible(false);
  }

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-[9999] flex items-center justify-between gap-3 rounded-2xl border border-violet-500/30 bg-[#1a0d2e] shadow-2xl shadow-violet-900/40 px-4 py-3"
      style={{
        animation: "slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <style>{`@keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30">
          <span className="text-white font-black text-lg">A</span>
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-bold leading-tight truncate">Install {appName}</p>
          <p className="text-violet-300 text-xs leading-tight">Quick access from your home screen</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstall}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-500/30"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition text-base"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
