import { comicFeedData } from '@src/feed-data'
import type { ComicMeta } from '@src/import-utils'
import type { MarkdownInstance } from 'astro'
import { XMLBuilder } from 'fast-xml-parser'

const xmlOptions = {
  ignoreAttributes: false,
  suppressEmptyNode: true,
  suppressBooleanAttributes: false,
  format: true,
}

export function GET() {
  const allPosts = import.meta.glob<MarkdownInstance<ComicMeta>>(
    '../../../../comics/*/README.md',
    { eager: true },
  )
  const allPanels = import.meta.glob<{ default: ImageMetadata }>(
    '../../../../comics/*/thumbnail.jpg',
    { eager: true },
  )

  const data = comicFeedData(allPosts, allPanels)

  const root = {
    '?xml': {
      '@_version': '1.0',
      '@_encoding': 'UTF-8',
    },
    rss: {
      channel: {
        '@_version': '2.0',
        title: data.title,
        description: data.description,
        link: data.link,
        language: 'en',
        lastBuildDate: new Date().toUTCString(),
        image: {
          title: data.title,
          url: data.bannerUrl,
          link: data.link,
        },
        item: data.entries.map((entry) => ({
          title: entry.title,
          link: entry.fullUrl,
          pubDate: new Date(entry.date).toUTCString(),
          guid: entry.fullUrl,
          description: `<![CDATA[${entry.contentHTML}]]>`,
        })),
      },
    },
  }

  const xml = new XMLBuilder(xmlOptions).build(root)

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml;charset=UTF-8',
    },
  })
}
