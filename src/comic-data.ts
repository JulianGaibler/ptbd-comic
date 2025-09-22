import type { AstroComponentFactory } from 'astro/runtime/server/index.js'
import {
  findThumbnail,
  type PanelsArg,
  type PostsArg,
  type ThumbnailsArg,
  findPanels,
  generateExcerpt,
} from './import-utils'
import path from 'path'

export interface ComicProps {
  title: string
  date: Date
  panelFiles: ImageMetadata[]
  thumbnailFile: ImageMetadata
  description: string
  alt?: string[]
  Content: AstroComponentFactory
  comicId: string
  nextComic?: string
  prevComic?: string
}

export interface ComicParams {
  comic: string
}

export interface ComicData {
  params: ComicParams
  props: ComicProps
}

export const comicDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export async function getAllComics(
  allPosts: PostsArg,
  allPanels: PanelsArg,
  allThumbnails: ThumbnailsArg,
): Promise<ComicData[]> {
  const comics = Object.entries(allPosts)
    .map(([postPath, data]) => {
      // first establish comic number based on folder name
      const folders = postPath.split(path.sep)
      const comicID = folders[folders.length - 2]
      // the directory of the readme also contains the individual comic panels, numbered panel1.png to paneln.png. Lets use fs to determine how many there are
      const comicPath = path.join(path.dirname(data.file))

      const comicPanels = findPanels(allPanels, comicPath, comicID)
      const thumbnailFile = findThumbnail(allThumbnails, comicPath, comicID)
      const excerpt = generateExcerpt(data)

      if (!excerpt) throw new Error(`No excerpt found for comic ${comicID}`)

      return {
        comicID,
        comicFiles: comicPanels,
        thumbnailFile,
        description: excerpt,
        data,
      }
    })
    .sort((a, b) => parseInt(a.comicID) - parseInt(b.comicID))

  // map with index
  return comics.map(
    (
      { comicID: comicId, comicFiles, thumbnailFile, description, data },
      index,
    ) => {
      return {
        params: {
          comic: comicId,
        },
        props: {
          panelFiles: comicFiles,
          thumbnailFile,
          title: data.frontmatter.title,
          description,
          alt: data.frontmatter.alt,
          date: new Date(data.frontmatter.date),
          Content: data.Content,
          comicId,
          nextComic: comics[index + 1]?.comicID,
          prevComic: comics[index - 1]?.comicID,
        },
      }
    },
  )
}
