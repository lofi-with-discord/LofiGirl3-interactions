import { CommandData } from '../types'
import { DefaultEmbed } from '../utils'
import { replyInteraction } from '../scripts/interactionReply'
import { createSelectMenu, resolveMenuSelection } from '../scripts/selectMenu'

import {
  ApplicationCommandData,
  CommandInteraction,
  GuildChannel,
  GuildMember,
  MessageSelectOptionData,
  VoiceChannel
} from 'discord.js'

export default async function MarkCommand ({ interaction, db, locale, player }: CommandData) {
  const member = interaction.member as GuildMember
  let targetChannel = interaction.options.getChannel('channel') || member.voice.channel

  if (!member.permissions.has('MANAGE_CHANNELS')) {
    replyInteraction(interaction, locale('mark_no_permission', member.displayName))
    return
  }

  if (!targetChannel) {
    const embed = new DefaultEmbed('mark')
      .setTitle(locale('mark_select_voice'))

    const options = [] as MessageSelectOptionData[]
    for (const channelId of interaction.guild?.channels.cache.keys()!) {
      const channel = interaction.guild?.channels.cache.get(channelId)

      if (!channel) continue
      if (channel.type !== 'GUILD_VOICE') continue

      options.push({
        label: channel.name,
        value: channel.id,
        default: false
      })
    }

    const selMenu = createSelectMenu(interaction, options, locale('mark_select_voice_placeholder'))
    replyInteraction(interaction, embed, selMenu)

    const res = await resolveMenuSelection(interaction)
    if (!res) return

    selMenu.setDisabled(true)
    replyInteraction(interaction, embed, selMenu)

    interaction = res.interaction! as unknown as CommandInteraction
    targetChannel = interaction.guild?.channels.cache.get(res.result!) as GuildChannel
  }

  if (!targetChannel || targetChannel.type !== 'GUILD_VOICE') {
    replyInteraction(interaction, locale('mark_select_not_exist', targetChannel.name))
    return
  }

  const targetVoiceChannel = targetChannel as VoiceChannel

  if (!targetVoiceChannel.joinable) return replyInteraction(interaction, locale('mark_not_joinable'))
  if (!targetVoiceChannel.speakable) return replyInteraction(interaction, locale('mark_not_speakable'))

  await db.markChannel(interaction.guild!, targetVoiceChannel)

  replyInteraction(interaction, locale('mark_success', targetVoiceChannel.name, '/'))

  player.clear()
  if (!interaction.guild?.me?.voice?.channel) {
    player.play(targetVoiceChannel)
  }
}

export const metadata: ApplicationCommandData = {
  name: 'mark',
  description: 'you can set up a channel to play Lo-Fi all the time.',
  options: [{ name: 'channel', type: 'CHANNEL', description: 'a channel to mark' }]
}
