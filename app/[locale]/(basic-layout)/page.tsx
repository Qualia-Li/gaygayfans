import { getFeedVideos } from "@/actions/feed";
import GaylyFansHome from "@/components/gaylyfans/GaylyFansHome";

export default async function Home() {
  const videos = await getFeedVideos();
  return <GaylyFansHome initialVideos={videos} />;
}
