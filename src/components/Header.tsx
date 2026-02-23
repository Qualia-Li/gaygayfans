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
        className="pointer-events-auto text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 px-4 py-1.5 rounded-full shadow-lg shadow-pink-500/30 transition-all animate-pulse hover:animate-none drop-shadow-lg"
      >
        Rate Videos
      </Link>
    </div>
  );
}
