import yts from 'yt-search'
import { MessageEmbed, MessageEmbedOptions, Role } from 'discord.js'

export class DefaultEmbed extends MessageEmbed {
  constructor (situation?: string, roleForColoring?: Role | null, options?: MessageEmbed | MessageEmbedOptions) {
    super(options)
    this.color = roleForColoring?.color || 0xdf73ff
    this.setAuthor(`${situation ? `Lofi Girl - ${situation}` : 'Lofi Girl'}`, 'https://cdn.discordapp.com/avatars/763033945767280650/69e2a6ad9703274d0f109a2b88f290af.webp')
    this.setThumbnail('https://media.discordapp.net/attachments/708927519973441556/763208406047129631/994BB93F5AD305BF02.png')
  }
}

export async function getYtInfo (urlstr: string) {
  const url = new URL(urlstr)
  return await yts({ videoId: url.searchParams.get('v')! })
}
