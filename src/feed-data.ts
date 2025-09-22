import { comicDateFormatter } from './comic-data'
import { FULLDOMAIN } from './constants'
import {
  findThumbnail,
  type PostsArg,
  type ThumbnailsArg,
} from './import-utils'
import path from 'path'

export interface Entry {
  title: string
  date: Date
  imgUrl: string
  fullUrl: string
  thumbnailUrl: string
  contentHTML: string
  comicID: string
}

export interface Feed {
  title: string
  link: string
  description: string
  faviconUrl: string
  bannerUrl: string
  entries: Entry[]
}

function generateHTML(
  title: string,
  date: Date,
  imgUrl: string,
  fullUrl: string,
): string {
  return `<h1>${title}</h1>
<p>${comicDateFormatter.format(date)}</p>
<img src="${imgUrl}" alt="No alt text available" />
<a href="${fullUrl}">Read on the site</a>`
}

export function comicFeedData(
  allPosts: PostsArg,
  allThumbnails: ThumbnailsArg,
): Feed {
  const comics = Object.entries(allPosts)
    .map(([postPath, data]) => {
      // first establish comic number based on folder name
      const folders = postPath.split(path.sep)
      const comicID = folders[folders.length - 2]

      const comicPath = path.join(path.dirname(data.file))
      const thumbnailFile = findThumbnail(allThumbnails, comicPath, comicID)

      const title = data.frontmatter.title
      const date = new Date(data.frontmatter.date)
      const imgUrl = `${FULLDOMAIN}/share/${comicID}.png`
      const fullUrl = `${FULLDOMAIN}/comic/${comicID}`

      return {
        title,
        date,
        fullUrl,
        thumbnailUrl: `${FULLDOMAIN}${thumbnailFile.src}`,
        contentHTML: generateHTML(title, date, imgUrl, fullUrl),
        imgUrl,
        comicID,
      }
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  return {
    title: 'Pretends to be Drawing',
    link: `${FULLDOMAIN}`,
    description: 'This is a Webcomic. I hope.',
    faviconUrl: `${FULLDOMAIN}/favicon.ico`,
    bannerUrl: `${FULLDOMAIN}/default-banner.png`,
    entries: comics,
  }
}
