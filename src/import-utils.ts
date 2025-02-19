import type { MarkdownInstance } from 'astro'
import fs from 'node:fs'
import path from 'path'

export interface ComicMeta {
  title: string
  date: string
  alt?: string[]
}

export type PostsArg = Record<string, MarkdownInstance<ComicMeta>>
export type PanelsArg = Record<
  string,
  {
    default: ImageMetadata
  }
>
export type ThumbnailsArg = Record<
  string,
  {
    default: ImageMetadata
  }
>

/**
 * Finds the thumbnail image for a given comic and returns its metadata.
 *
 * @param allThumbnails - An object containing metadata for all available
 *   thumbnails.
 * @param comicPath - The path to the directory containing the comic files.
 * @param comicID - The ID of the comic to find the thumbnail for.
 * @returns The metadata for the thumbnail image.
 * @throws An error if the thumbnail image cannot be found.
 */
export function findThumbnail(
  allThumbnails: ThumbnailsArg,
  comicPath: string,
  comicID: string,
): ImageMetadata {
  const thumbnailFile = fs
    .readdirSync(comicPath)
    .find((file) => file === 'thumbnail.jpg')
  const thumbnail = Object.entries(allThumbnails).find((p) =>
    p[0].includes(`${comicID}${path.sep}${thumbnailFile}`),
  )
  if (!thumbnail) throw new Error(`Thumbnail not found for comic ${comicID}`)

  return thumbnail[1].default
}

/**
 * Finds the panels for a given comic in the file system and matches them to the
 * allPanels array to get the correct path.
 *
 * @param allPanels - An object containing all the panels for all the comics.
 * @param comicPath - The path to the directory containing the comic panels.
 * @param comicID - The ID of the comic whose panels are being searched for.
 * @returns An array of imported panels for the given comic.
 * @throws An error if a panel is not found for the given comic.
 */
export function findPanels(
  allPanels: PanelsArg,
  comicPath: string,
  comicID: string,
) {
  return (
    fs
      .readdirSync(comicPath)
      .filter((file) => file.startsWith('panel'))
      .sort((a, b) => {
        const aNum = parseInt(a.replace('panel', '').replace('.png', ''))
        const bNum = parseInt(b.replace('panel', '').replace('.png', ''))
        return aNum - bNum
      })
      // next we match the comic panels to the allPanels array to get the correct path
      .map((panel) => {
        // /${comicID}/${panel}
        const importedPanel = Object.entries(allPanels).find((p) =>
          p[0].includes(`${comicID}${path.sep}${panel}`),
        )
        if (!importedPanel) {
          throw new Error(`Panel ${panel} not found for comic ${comicID}`)
        }
        return importedPanel[1].default
      })
  )
}

/**
 * Generates an excerpt from the raw content of a MarkdownInstance<ComicMeta>.
 * The excerpt is generated by looking for the first non-empty line and taking
 * the first sentence (sentences end with any repetition of .!? followed by a
 * space). If the first sentence is longer than 200 characters, it is
 * truncated.
 *
 * @param data The MarkdownInstance<ComicMeta> to generate the excerpt from.
 * @returns The generated excerpt.
 */
export function generateExcerpt(data: MarkdownInstance<ComicMeta>) {
  return data
    .rawContent()
    .split('\n')
    .find((line) => line.length > 0)
    ?.split(/(?<=[.!?])\s/)[0]
    .slice(0, 200)
}
