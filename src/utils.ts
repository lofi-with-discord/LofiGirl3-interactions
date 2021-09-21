import _ from './consts'

import yts from 'yt-search'
import { CommandInteraction, MessageEmbed } from 'discord.js'

export class DefaultEmbed extends MessageEmbed {
  constructor (interactionOrFlag: CommandInteraction | string) {
    super()

    const embedAuthor =
      interactionOrFlag instanceof CommandInteraction
        ? interactionOrFlag.commandName
        : interactionOrFlag

    this.setThumbnail(_.EMBED_THUMBNAIL)
    this.setAuthor(_.EMBED_AUTHOR_NAME(embedAuthor), _.EMBED_AUTHOR_ICON)
  }
}

export function getYtInfo (rawUrl: string) {
  const url = new URL(rawUrl)
  const videoId = url.searchParams.get(_.YOUTUBE_SEARCH_PARAM)!

  return yts({ videoId })
}

export function deepCopy<T> (value: T): T {
  return JSON.parse(JSON.stringify(value))
}
