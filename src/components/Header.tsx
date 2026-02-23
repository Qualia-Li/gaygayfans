"use client";

import Link from "next/link";

export default function Header() {
  return (
    <div className="pointer-events-none fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 pt-3 pb-2">
      <div className="pointer-events-auto flex items-center gap-2">
        <span className="text-lg">🏳️‍🌈</span>
        <h1 className="text-lg font-bold text-white drop-shadow-lg">
          GayGayFans
        </h1>
      </div>
      <Link
        href="/rate"
        className="pointer-events-auto text-sm font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full backdrop-blur transition-all drop-shadow-lg"
      >
        Rate
      </Link>
    </div>
  );
}
