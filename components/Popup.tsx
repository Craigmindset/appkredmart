"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const POPUP_KEY = "kredmart_popup_last_shown";
const POPUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in ms

export default function Popup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check last shown time in localStorage
    const lastShown = localStorage.getItem(POPUP_KEY);
    const now = Date.now();
    if (!lastShown || now - parseInt(lastShown, 10) > POPUP_INTERVAL) {
      setOpen(true);
      localStorage.setItem(POPUP_KEY, now.toString());
    }
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg max-w-xs w-full p-0 md:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-700 hover:text-red-500 text-3xl md:text-4xl font-bold bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow-md border border-gray-200"
          onClick={() => setOpen(false)}
          aria-label="Close popup"
          style={{ zIndex: 10 }}
        >
          ×
        </button>
        <Image
          src="/images/pop.png"
          alt="Popup"
          width={350}
          height={350}
          className="rounded-lg w-full h-auto object-contain"
          priority
        />
      </div>
    </div>
  );
}
