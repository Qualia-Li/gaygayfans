"use client";

import { useAgeGate } from "@/store/ageGate";

export default function AgeGate() {
  const setVerified = useAgeGate((s) => s.setVerified);

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 max-w-md w-full rounded-2xl bg-zinc-900 p-8 text-center">
        <div className="mb-6 text-5xl" aria-hidden="true">🏳️‍🌈</div>
        <h1 className="mb-2 text-2xl font-bold text-white">
          Welcome to GayGayFans
        </h1>
        <p className="mb-8 text-sm text-zinc-300">
          Before entering, please confirm the following:
        </p>

        <div className="mb-8 space-y-4 text-left" role="list">
          <div className="flex items-start gap-3 rounded-xl bg-zinc-800 p-4" role="listitem">
            <span className="mt-0.5 text-lg" aria-hidden="true">🔞</span>
            <div>
              <p className="font-medium text-white">I am 18 years or older</p>
              <p className="text-xs text-zinc-300">
                This site contains adult-oriented content intended for mature
                audiences only.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-zinc-800 p-4" role="listitem">
            <span className="mt-0.5 text-lg" aria-hidden="true">🏳️‍🌈</span>
            <div>
              <p className="font-medium text-white">
                I want to view gay content
              </p>
              <p className="text-xs text-zinc-300">
                This site features adult content created for and by gay men.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-zinc-800 p-4" role="listitem">
            <span className="mt-0.5 text-lg" aria-hidden="true">🌍</span>
            <div>
              <p className="font-medium text-white">
                My location allows me to view this content
              </p>
              <p className="text-xs text-zinc-300">
                You are responsible for ensuring that accessing this content is
                legal in your jurisdiction.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setVerified(true)}
          className="w-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 py-3 font-semibold text-white transition-transform hover:scale-105 active:scale-95"
        >
          I Confirm All of the Above — Enter
        </button>

        <a
          href="https://google.com"
          className="mt-4 block text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          No, take me away
        </a>
      </div>
    </main>
  );
}
