import { Locale } from '../types'
import { DefaultEmbed, getYtInfo } from '../utils'
import PlayerClient from '../structures/PlayerClient'
import DatabaseClient from '../structures/DatabaseClient'
import { RawMessageSelectMenuInteractionData } from 'discord.js/typings/rawDataTypes'
import { ApplicationCommandData, CommandInteraction, GuildChannel, GuildMember, InteractionReplyOptions, MessageButton, MessageComponentInteraction, MessageSelectMenu, MessageSelectOptionData, VoiceChannel } from 'discord.js'

export default async function PlayCommand (interaction: CommandInteraction, _: any, db: DatabaseClient, locale: Locale, player: PlayerClient) {
  let nextInteraction: MessageComponentInteraction | undefined
  const member = interaction.member as GuildMember

  function reply (options: InteractionReplyOptions) {
    if (nextInteraction && nextInteraction.replied) nextInteraction.editReply(options)
    else if (nextInteraction && !nextInteraction.replied) nextInteraction.reply(options)
    else if (interaction.replied) interaction.editReply(options)
    else interaction.reply(options)
  }

  let targetChannel = interaction.options.getChannel('channel') || member.voice.channel
  const meAt = interaction.guild?.me?.voice.channel

  if (!targetChannel) {
    const embed = new DefaultEmbed('mark', interaction.guild?.me?.roles.color, {
      title: locale('play_select_voice')
    })

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

    const selMenu = new MessageSelectMenu({ customId: `selMenu_${interaction.id}`, minValues: 1, maxValues: 1, options, placeholder: locale('play_select_voice_placeholder') })
    interaction.reply({ embeds: [embed], components: [{ components: [selMenu], type: 1 }] })

    nextInteraction = await interaction.channel?.awaitMessageComponent({ filter: (i: MessageComponentInteraction) => i.customId === `selMenu_${interaction.id}` && interaction.user.id === i.user.id })
    if (!nextInteraction) return

    selMenu.setDisabled(true)
    interaction.editReply({ embeds: [embed], components: [{ components: [selMenu], type: 1 }] })

    const [channelId] = (nextInteraction as unknown as RawMessageSelectMenuInteractionData).values
    targetChannel = interaction.guild?.channels.cache.get(channelId) as GuildChannel
  }

  if (!targetChannel || targetChannel.type !== 'GUILD_VOICE') return reply({ ephemeral: true, content: locale('play_select_not_exist') })
  const targetVoiceChannel = targetChannel as VoiceChannel

  if (!targetVoiceChannel.joinable) return reply({ ephemeral: true, content: locale('play_not_joinable') })
  if (!targetVoiceChannel.speakable) return reply({ ephemeral: true, content: locale('play_not_speakable') })

  if (meAt) {
    const membersIn = meAt.members.filter((m) => !m.user.bot && m.id !== interaction.user.id).size
    const movePerm = member.permissions.has('MOVE_MEMBERS')

    if (membersIn > 1) {
      if (!movePerm) return reply({ ephemeral: true, content: locale('play_force_fail', meAt.name) })

      const forceBtn = new MessageButton({ customId: `forceBtn_${interaction.id}`, emoji: '🔨', style: 'DANGER' })
      reply({ content: locale('play_force_question', meAt.name), components: [{ components: [forceBtn], type: 1 }] })

      const forceInteraction = await interaction.channel?.awaitMessageComponent({ filter: (i) => i.customId === `forceBtn_${interaction.id}` && i.user.id === interaction.user.id })
      nextInteraction = forceInteraction
    }
  }

  const channelData = await db.getChannelData(interaction.guild!)

  const themeNo = channelData?.theme || 1
  const themeData = await db.getThemeData(themeNo)

  if (!themeData) return reply({ ephemeral: true, content: locale('play_theme_fail', '/') })
  await player.play(targetVoiceChannel)

  const data = await getYtInfo(themeData.url)

  const embed = new DefaultEmbed('play', interaction.guild?.me?.roles.color, {
    title: data.title,
    description: locale('play_detail', data.author.name, data.url)
  }).setImage(data.image)
    .setFooter(locale('play_detail_footer', '/'))

  reply({ embeds: [embed] })
}

export const metadata: ApplicationCommandData = {
  name: 'play',
  description: 'Play a Lo-Fi stream with a set theme',
  options: [{ name: 'channel', type: 'CHANNEL', description: 'a channel to play' }]
}
