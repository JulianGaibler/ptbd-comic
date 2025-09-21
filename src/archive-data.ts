import {
  findThumbnail,
  type PostsArg,
  type ThumbnailsArg,
} from './import-utils'
import path from 'path'

export interface ArchiveItem {
  comicID: string
  title: string
  date: Date
  thumbnailFile: ImageMetadata
}

export interface ArchiveProps {
  year: string
  humanEraYear: string
  items: ArchiveItem[]
  nextYear: string | undefined
  prevYear: string | undefined
}

export interface ArchiveParams {
  year: string
}

export interface ArchiveData {
  params: ArchiveParams
  props: ArchiveProps
}

function addSeparatorPoints(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export async function getAllArchives(
  allPosts: PostsArg,
  allThumbnails: ThumbnailsArg,
): Promise<ArchiveData[]> {
  const comics: ArchiveItem[] = Object.entries(allPosts).map(
    ([postPath, data]) => {
      const folders = postPath.split(path.sep)
      const comicID = folders[folders.length - 2]

      const comicPath = path.join(path.dirname(data.file))
      const thumbnailFile = findThumbnail(allThumbnails, comicPath, comicID)

      return {
        comicID: comicID,
        title: data.frontmatter.title,
        date: new Date(data.frontmatter.date),
        thumbnailFile,
      }
    },
  )

  const comicsByYear = comics.reduce(
    (acc, comic) => {
      const year = comic.date.getFullYear()
      if (!acc[year]) acc[year] = []
      acc[year].push(comic)
      return acc
    },
    {} as Record<string, ArchiveItem[]>,
  )

  // Get sorted list of available years
  const availableYears = Object.keys(comicsByYear)
    .map((year) => parseInt(year))
    .sort((a, b) => a - b)

  // map with index
  return Object.entries(comicsByYear).map(([year, comics]) => {
    const currentYear = parseInt(year)
    const currentIndex = availableYears.indexOf(currentYear)

    // Find the next and previous years that actually have content
    const nextYear =
      currentIndex < availableYears.length - 1
        ? availableYears[currentIndex + 1].toString()
        : undefined
    const prevYear =
      currentIndex > 0 ? availableYears[currentIndex - 1].toString() : undefined

    return {
      params: {
        year,
      },
      props: {
        humanEraYear: addSeparatorPoints(parseInt(`1${year}`)),
        year,
        items: comics.sort((a, b) => b.date.getTime() - a.date.getTime()),
        nextYear,
        prevYear,
      },
    }
  })
}
