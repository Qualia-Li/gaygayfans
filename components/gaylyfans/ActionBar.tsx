"use client";

import { useState, useEffect } from "react";
import { useFeedStore } from "@/stores/feedStore";
import type { FeedVideo } from "@/types/gaylyfans";
import { submitReport } from "@/actions/feed";

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

const REPORT_REASONS = [
  { id: "not_interested", label: "Not interested", icon: "👎" },
  { id: "low_quality", label: "Low quality", icon: "📉" },
  { id: "rights_violation", label: "Violates my rights / IP", icon: "⚖️" },
  { id: "child_content", label: "Involves a minor", icon: "🚨" },
];

const LIKES_KEY = "ggf-likes";
const REPORTS_KEY = "ggf-reports";

function getStoredSet(key: string): Set<string> {
  try {
    const data = localStorage.getItem(key);
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch {
    return new Set();
  }
}

function storeSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

export default function ActionBar({ videos }: { videos: FeedVideo[] }) {
  const currentVideoId = useFeedStore((s) => s.currentVideoId);
  const [likedSet, setLikedSet] = useState<Set<string>>(new Set());
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  const [reportedSet, setReportedSet] = useState<Set<string>>(new Set());
  const [showReport, setShowReport] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setLikedSet(getStoredSet(LIKES_KEY));
    setReportedSet(getStoredSet(REPORTS_KEY));
  }, []);

  const originalId = currentVideoId?.replace(/-\d+$/, "") ?? null;
  const video = videos.find((v) => String(v.id) === originalId);
  if (!video || !originalId) return null;

  const liked = likedSet.has(originalId);
  const likeCount = likeCountMap[originalId] ?? video.likes + (liked ? 1 : 0);
  const reported = reportedSet.has(originalId);

  const handleLike = () => {
    const newSet = new Set(likedSet);
    if (liked) {
      newSet.delete(originalId);
      setLikeCountMap((m) => ({ ...m, [originalId]: (m[originalId] ?? video.likes + 1) - 1 }));
    } else {
      newSet.add(originalId);
      setLikeCountMap((m) => ({ ...m, [originalId]: (m[originalId] ?? video.likes) + 1 }));
    }
    setLikedSet(newSet);
    storeSet(LIKES_KEY, newSet);
  };

  const handleReport = async (reason: string) => {
    setShowReport(false);
    const newSet = new Set(reportedSet);
    newSet.add(originalId);
    setReportedSet(newSet);
    storeSet(REPORTS_KEY, newSet);
    setShowConfirmation(true);
    try {
      await submitReport(Number(originalId), reason);
    } catch {}
    setTimeout(() => {
      setShowConfirmation(false);
      const current = document.querySelector(`[data-video-id="${currentVideoId}"]`);
      if (current?.nextElementSibling) {
        current.nextElementSibling.scrollIntoView({ behavior: "smooth" });
      }
    }, 1500);
  };

  return (
    <>
      <div className="fixed right-3 bottom-32 z-20 flex flex-col items-center gap-5">
        <div className="relative mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-2xl ring-2 ring-white">
            {video.creatorAvatar}
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
            +
          </div>
        </div>

        <button onClick={handleLike} className="flex flex-col items-center">
          <div className={`text-3xl transition-transform ${liked ? "scale-125" : ""}`}>
            {liked ? "❤️" : "🤍"}
          </div>
          <span className="mt-1 text-xs font-semibold text-white drop-shadow">
            {formatCount(likeCount)}
          </span>
        </button>

        <button onClick={() => setShowReport(true)} className="flex flex-col items-center">
          {reported ? (
            <span className="text-2xl">✅</span>
          ) : (
            <svg className="h-7 w-7 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 3v12l5-3 4 3 4-3 5 3V3H3z" />
            </svg>
          )}
          <span className="mt-1 text-xs font-semibold text-white drop-shadow">
            {reported ? "Sent" : "Report"}
          </span>
        </button>
      </div>

      {showReport && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60" onClick={() => setShowReport(false)}>
          <div className="w-full max-w-sm mb-20 mx-4 rounded-2xl bg-zinc-900 p-4 space-y-2" onClick={(e) => e.stopPropagation()}>
            <p className="text-white font-medium text-center mb-3">Report this video</p>
            {REPORT_REASONS.map((r) => (
              <button
                key={r.id}
                onClick={() => handleReport(r.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-left"
              >
                <span className="text-lg">{r.icon}</span>
                <span className="text-white text-sm">{r.label}</span>
              </button>
            ))}
            <button onClick={() => setShowReport(false)} className="w-full py-2 text-zinc-400 text-sm mt-2">
              Cancel
            </button>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/60" onClick={() => setShowConfirmation(false)}>
          <div className="w-full max-w-sm mb-20 mx-4 rounded-2xl bg-zinc-900 p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <span className="text-4xl block mb-3">✅</span>
            <p className="text-white font-medium mb-2">Thanks for your report</p>
            <p className="text-zinc-400 text-sm mb-4">We will review this internally.</p>
            <button onClick={() => setShowConfirmation(false)} className="px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors text-white text-sm">
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
