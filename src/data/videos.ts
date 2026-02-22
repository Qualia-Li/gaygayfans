export interface Video {
  id: string;
  videoUrl: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
}

export const videos: Video[] = [
  {
    id: "1",
    videoUrl: "https://videos.pexels.com/video-files/5529540/5529540-uhd_1440_2560_30fps.mp4",
    title: "Summer vibes at the beach",
    creator: "beachboy",
    creatorAvatar: "🏖️",
    likes: 12400,
    comments: 342,
    shares: 89,
    tags: ["summer", "beach", "vibes"],
  },
  {
    id: "2",
    videoUrl: "https://videos.pexels.com/video-files/4812204/4812204-uhd_1440_2560_25fps.mp4",
    title: "City lights never sleep",
    creator: "urbanking",
    creatorAvatar: "🌃",
    likes: 8700,
    comments: 213,
    shares: 56,
    tags: ["city", "nightlife", "urban"],
  },
  {
    id: "3",
    videoUrl: "https://videos.pexels.com/video-files/3571264/3571264-uhd_1440_2560_30fps.mp4",
    title: "Morning workout motivation",
    creator: "fitguy",
    creatorAvatar: "💪",
    likes: 23100,
    comments: 891,
    shares: 234,
    tags: ["fitness", "workout", "motivation"],
  },
  {
    id: "4",
    videoUrl: "https://videos.pexels.com/video-files/4434242/4434242-uhd_1440_2560_24fps.mp4",
    title: "Sunset from the rooftop",
    creator: "skygazer",
    creatorAvatar: "🌅",
    likes: 15600,
    comments: 432,
    shares: 167,
    tags: ["sunset", "rooftop", "aesthetic"],
  },
  {
    id: "5",
    videoUrl: "https://videos.pexels.com/video-files/5752729/5752729-uhd_1440_2560_30fps.mp4",
    title: "Dance like nobody's watching",
    creator: "dancequeen",
    creatorAvatar: "💃",
    likes: 31200,
    comments: 1204,
    shares: 567,
    tags: ["dance", "fun", "party"],
  },
  {
    id: "6",
    videoUrl: "https://videos.pexels.com/video-files/4065924/4065924-uhd_1440_2560_24fps.mp4",
    title: "Cooking date night",
    creator: "chefboi",
    creatorAvatar: "👨‍🍳",
    likes: 9800,
    comments: 276,
    shares: 98,
    tags: ["cooking", "date", "food"],
  },
];
