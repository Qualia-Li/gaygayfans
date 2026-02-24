"use client";

import { useEffect, useState } from "react";

export default function WeChatBlocker() {
  const [isWeChat, setIsWeChat] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("micromessenger") || ua.includes("wechat")) {
      setIsWeChat(true);
    }
  }, []);

  if (!isWeChat) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm px-6">
      {/* Arrow pointing to top-right ••• menu */}
      <div className="absolute top-4 right-8 text-orange-400 animate-bounce">
        <svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M40 110 C30 70, 20 50, 50 20"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M42 12 L54 20 L40 26" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>

      {/* Card */}
      <div className="bg-zinc-900 rounded-2xl p-8 max-w-sm w-full text-center space-y-5 shadow-2xl border border-zinc-800">
        <h2 className="text-xl font-bold text-white">Open in Browser</h2>

        <div className="text-left text-zinc-300 text-sm space-y-3">
          <p>
            1. Tap <span className="inline-flex items-center justify-center bg-zinc-700 rounded px-1.5 py-0.5 text-xs font-bold mx-1">•••</span> at the top-right
          </p>
          <p>
            2. Select <strong className="text-white">Open in Browser</strong>
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-base transition-all active:scale-95"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>

        <p className="text-zinc-500 text-xs">
          If you don&apos;t see &quot;Open in Browser&quot;, copy the link and paste it into Browser manually.
        </p>
      </div>
    </div>
  );
}
