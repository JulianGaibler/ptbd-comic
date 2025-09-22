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
    '../../../comics/*/README.md',
    { eager: true },
  )
  const allPanels = import.meta.glob<{ default: ImageMetadata }>(
    '../../../comics/*/thumbnail.jpg',
    { eager: true },
  )

  const data = comicFeedData(allPosts, allPanels)

  const root = {
    '?xml': {
      '@_version': '1.0',
      '@_encoding': 'UTF-8',
    },
    feed: {
      '@_xmlns': 'http://www.w3.org/2005/Atom',
      id: data.link,
      title: data.title,
      subtitle: data.description,
      updated: new Date().toISOString(),
      link: [
        {
          '@_rel': 'alternate',
          '@_href': data.link,
        },
        {
          '@_rel': 'self',
          '@_href': `${data.link}/feed`,
        },
      ],
      icon: data.faviconUrl,
      logo: data.bannerUrl,
      entry: data.entries.map((entry) => ({
        title: entry.title,
        link: {
          '@_rel': 'alternate',
          '@_href': entry.fullUrl,
        },
        updated: new Date(entry.date).toISOString(),
        id: entry.fullUrl,
        summary: {
          '@_type': 'html',
          '#text': `<![CDATA[${entry.contentHTML}]]>`,
        },
      })),
    },
  }

  const xml = new XMLBuilder(xmlOptions).build(root)

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml;charset=UTF-8',
    },
  })
}
