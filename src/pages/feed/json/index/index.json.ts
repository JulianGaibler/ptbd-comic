import { comicFeedData } from '@src/feed-data'
import type { ComicMeta } from '@src/import-utils'
import type { MarkdownInstance } from 'astro'

export function GET() {
  const allPosts = import.meta.glob<MarkdownInstance<ComicMeta>>(
    '../../../../../comics/*/README.md',
    { eager: true },
  )
  const allPanels = import.meta.glob<{ default: ImageMetadata }>(
    '../../../../../comics/*/thumbnail.jpg',
    { eager: true },
  )

  const data = comicFeedData(allPosts, allPanels)

  const root = {
    version: 'https://jsonfeed.org/version/1.1',
    title: data.title,
    home_page_url: data.link,
    feed_url: `${data.link}/feed/json`,
    description: data.description,
    icon: data.bannerUrl,
    favicon: data.faviconUrl,
    language: 'en',
    items: data.entries.map((entry) => ({
      id: entry.fullUrl,
      url: entry.fullUrl,
      title: entry.title,
      content_html: entry.contentHTML,
      banner_image: entry.thumbnailUrl,
      date_modified: new Date(entry.date).toISOString(),
    })),
  }

  const json = JSON.stringify(root)

  return new Response(json, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  })
}
