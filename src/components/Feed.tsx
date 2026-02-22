"use client";

import { videos } from "@/data/videos";
import VideoCard from "./VideoCard";

export default function Feed() {
  return (
    <div className="snap-container no-scrollbar">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
