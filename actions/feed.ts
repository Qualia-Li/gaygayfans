'use server'

import { db } from '@/lib/db'
import { feedVideos, videoLikes, reports } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import type { FeedVideo } from '@/types/gaylyfans'

export async function getFeedVideos(): Promise<FeedVideo[]> {
  const rows = await db
    .select()
    .from(feedVideos)
    .where(eq(feedVideos.isActive, true))
    .orderBy(desc(feedVideos.id))

  return rows.map((r) => ({
    id: r.id,
    videoUrl: r.videoUrl,
    title: r.title,
    creator: r.creator,
    creatorAvatar: r.creatorAvatar,
    likes: r.likes,
    comments: r.comments,
    shares: r.shares,
    tags: (r.tags as string[]) ?? [],
  }))
}

export async function toggleLike(videoId: number, visitorId: string) {
  // Check if already liked
  const existing = await db
    .select()
    .from(videoLikes)
    .where(and(eq(videoLikes.videoId, videoId), eq(videoLikes.visitorId, visitorId)))
    .limit(1)

  if (existing.length > 0) {
    await db.delete(videoLikes).where(eq(videoLikes.id, existing[0].id))
    return { liked: false }
  } else {
    await db.insert(videoLikes).values({ videoId, visitorId })
    return { liked: true }
  }
}

export async function submitReport(
  videoId: number,
  reason: string,
  detail?: string,
  userAgent?: string
) {
  await db.insert(reports).values({
    videoId,
    reason: reason as any,
    detail,
    userAgent,
  })
  return { ok: true }
}
