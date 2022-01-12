import { CommandData } from '../types'
import { DefaultEmbed, getYtInfo } from '../utils'
import { replyInteraction } from '../scripts/interactionReply'
import { createButton, resolveButton } from '../scripts/button'
import { createSelectMenu, resolveMenuSelection } from '../scripts/selectMenu'

import {
  ApplicationCommandData,
  CommandInteraction,
  GuildMember,
  MessageSelectOptionData,
  StageChannel,
  VoiceChannel
} from 'discord.js'
import { ChannelTypes } from 'discord.js/typings/enums'

export default async function PlayCommand ({ interaction, db, locale, player }: CommandData) {
  const member = interaction.member as GuildMember
  const meAt = interaction.guild?.me?.voice.channel

  let targetChannel = interaction.options.getChannel('channel') || member.voice.channel

  if (!targetChannel) {
    const embed = new DefaultEmbed('mark')
      .setTitle(locale('play_select_voice'))

    const options = [] as MessageSelectOptionData[]
    for (const channelId of interaction.guild?.channels.cache.keys()!) {
      const channel = interaction.guild?.channels.cache.get(channelId)

      if (!channel) continue
      if (!['GUILD_VOICE', 'GUILD_STAGE_VOICE'].includes(channel.type)) continue

      options.push({
        label: channel.name,
        value: channel.id,
        default: false
      })
    }

    const selMenu = createSelectMenu(interaction, options, locale('play_select_voice_placeholder'))
    replyInteraction(interaction, selMenu, embed)

    const res = await resolveMenuSelection(interaction)
    if (!res.success) return

    selMenu.setDisabled(true)
    replyInteraction(interaction, selMenu, embed)

    interaction = res.interaction as unknown as CommandInteraction
    targetChannel = interaction.guild?.channels.cache.get(res.result!) as VoiceChannel | StageChannel
  }

  if (!targetChannel || !['GUILD_VOICE', 'GUILD_STAGE_VOICE'].includes(targetChannel.type.toString())) {
    replyInteraction(interaction, locale('play_select_not_exist', targetChannel.name))
    return
  }

  const targetVoiceChannel = targetChannel as VoiceChannel

  if (!targetVoiceChannel.joinable) return replyInteraction(interaction, locale('play_not_joinable'))
  if (!targetVoiceChannel.speakable && !(targetVoiceChannel instanceof StageChannel)) return replyInteraction(interaction, locale('play_not_speakable'))

  if (meAt) {
    const membersIn = meAt.members.filter((m) => !m.user.bot && m.id !== interaction.user.id).size
    const movePerm = member.permissions.has('MOVE_MEMBERS')

    if (membersIn > 1) {
      if (!movePerm) return replyInteraction(interaction, locale('play_force_fail', meAt.name))

      const forceBtn = createButton(interaction, '🔨', 'DANGER')
      replyInteraction(interaction, locale('play_force_question', meAt.name), forceBtn)

      interaction = await resolveButton(interaction)! as unknown as CommandInteraction
      if (!interaction) return
    }
  }

  const channelData = await db.getChannelData(interaction.guild!)

  const themeNo = channelData?.theme || 1
  const themeData = await db.getThemeData(themeNo)

  if (!themeData) return replyInteraction(interaction, locale('play_theme_fail', '/'))
  player.play(targetVoiceChannel)

  const data = await getYtInfo(themeData.url)

  const embed = new DefaultEmbed('play')
    .setTitle(data.title)
    .setImage(data.image)
    .setFooter(locale('play_detail_footer', '/'))
    .setDescription(locale('play_detail', data.author.name, data.url))

  replyInteraction(interaction, embed)
}

export const metadata: ApplicationCommandData = {
  name: 'play',
  description: 'Play a Lo-Fi stream with a set theme',
  options: [{
    name: 'channel',
    type: 'CHANNEL',
    description: 'a channel to play',
    channel_types: [
      ChannelTypes.GUILD_VOICE,
      ChannelTypes.GUILD_STAGE_VOICE
    ]
  }]
}
