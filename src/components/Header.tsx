"use client";

export default function Header() {
  return (
    <div className="pointer-events-none fixed top-0 inset-x-0 z-40 flex items-center justify-center pt-3 pb-2">
      <div className="pointer-events-auto flex items-center gap-2">
        <span className="text-lg">🏳️‍🌈</span>
        <h1 className="text-lg font-bold text-white drop-shadow-lg">
          GayGayFans
        </h1>
      </div>
    </div>
  );
}
