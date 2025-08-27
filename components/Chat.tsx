"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";

// Update these to your details
const WHATSAPP_E164 = "2349057871672"; // no leading +
const SUPPORT_EMAIL = "support@kredmart.com";

type ChatOption = {
  label: string;
  onSelect: () => void;
  icon: React.ReactNode;
  description?: string;
};

const openWhatsApp = (phoneE164: string, message?: string) => {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  window.open(
    `https://wa.me/${phoneE164}${text}`,
    "_blank",
    "noopener,noreferrer"
  );
};

const openMailTo = (email: string, subject?: string) => {
  const s = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  window.location.href = `mailto:${email}${s}`;
};

const Chat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const CHAT_OPTIONS: ChatOption[] = [
    {
      label: "Direct Chat (WhatsApp)",
      description: "Fastest response",
      onSelect: () =>
        openWhatsApp(WHATSAPP_E164, "Hi! I need help on KredMart."),
      icon: (
        <svg
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M12.004 2.003c-5.522 0-9.997 4.475-9.997 9.997 0 1.762.464 3.484 1.345 4.995l-1.409 5.151a1 1 0 0 0 1.225 1.225l5.151-1.409a9.96 9.96 0 0 0 4.995 1.345c5.522 0 9.997-4.475 9.997-9.997s-4.475-9.997-9.997-9.997zm0 18.001a7.96 7.96 0 0 1-4.09-1.151l-.292-.172-3.057.837.837-3.057-.172-.292a7.96 7.96 0 0 1-1.151-4.09c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.406-5.845c-.242-.121-1.434-.707-1.655-.788-.221-.081-.382-.121-.543.121-.161.242-.623.788-.764.95-.141.161-.282.181-.524.06-.242-.121-1.022-.377-1.947-1.202-.72-.642-1.207-1.433-1.35-1.675-.141-.242-.015-.373.106-.494.109-.108.242-.282.363-.423.121-.141.161-.242.242-.403.081-.161.04-.302-.02-.423-.06-.121-.543-1.312-.744-1.797-.196-.471-.396-.406-.543-.414l-.463-.008c-.161 0-.423.06-.646.282-.221.221-.846.827-.846 2.017 0 1.19.866 2.341.986 2.502.121.161 1.704 2.604 4.134 3.545.578.199 1.028.317 1.379.406.579.147 1.106.126 1.522.077.464-.056 1.434-.586 1.637-1.152.202-.566.202-1.051.141-1.152-.06-.101-.221-.161-.463-.282z" />
        </svg>
      ),
    },
    {
      label: "Support (Email)",
      description: "Replies within 24 hrs",
      onSelect: () => openMailTo(SUPPORT_EMAIL, "KredMart Support"),
      icon: (
        <svg
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20V8.99l8 6.99 8-6.99V20H4z" />
        </svg>
      ),
    },
  ];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(t) &&
        btnRef.current &&
        !btnRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Close with Esc
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  }, []);

  return (
    <div
      className="fixed z-50 flex flex-col items-end"
      style={{
        // Respect iOS/Android safe areas so it doesn’t hug the screen edges
        right: "max(1rem, env(safe-area-inset-right))",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
      onKeyDown={onKeyDown}
    >
      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label="Chat options"
          className="mb-3 w-72 overflow-hidden rounded-2xl border border-black/5 bg-white/80 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 transition-all
                     dark:bg-zinc-900/80 dark:border-white/10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Small “online” indicator dot */}
                <span className="absolute -right-0 -bottom-0 block h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-zinc-900" />
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center font-semibold">
                  K
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  KredMart Support
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  How can we help?
                </p>
              </div>
            </div>
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-white/10"
              aria-label="Close menu"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Options */}
          <div className="flex flex-col py-1">
            {CHAT_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  opt.onSelect();
                }}
                className="group flex items-center gap-3 px-4 py-3 text-left w-full
                           hover:bg-black/[0.04] focus:bg-black/[0.04] focus:outline-none
                           dark:hover:bg-white/[0.06] dark:focus:bg-white/[0.06]"
              >
                <div
                  className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-100 text-zinc-700 group-hover:scale-105 transition-transform
                                dark:bg-zinc-800 dark:text-zinc-200"
                >
                  {opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate dark:text-zinc-100">
                    {opt.label}
                  </p>
                  {opt.description && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {opt.description}
                    </p>
                  )}
                </div>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className="opacity-60 group-hover:translate-x-0.5 transition-transform"
                >
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAB (Trigger Button) */}
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="relative h-12 w-12 rounded-full text-white shadow-2xl outline-none
             bg-gradient-to-br from-blue-600 to-indigo-600 hover:brightness-105 active:scale-95
             focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
             dark:focus-visible:ring-offset-zinc-900"
        aria-label={open ? "Close chat options" : "Open chat options"}
        aria-expanded={open}
        aria-controls="kredmart-chat-options"
      >
        {/* subtle “ping” indicator */}
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500">
          <span className="absolute inset-0 rounded-full animate-ping bg-emerald-500/60"></span>
        </span>

        {/* compact icon */}
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          className="mx-auto"
        >
          <path
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.657.403 3.22 1.11 4.59L2 22l5.41-1.11A9.953 9.953 0 0 0 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 12h.01M12 12h.01M16 12h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Chat;
