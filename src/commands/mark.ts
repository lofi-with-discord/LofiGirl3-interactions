import { Locale } from '../types'
import { DefaultEmbed } from '../utils'
import PlayerClient from '../structures/PlayerClient'
import DatabaseClient from '../structures/DatabaseClient'
import { RawMessageSelectMenuInteractionData } from 'discord.js/typings/rawDataTypes'
import { ApplicationCommandData, CommandInteraction, GuildChannel, GuildMember, InteractionReplyOptions, MessageComponentInteraction, MessageSelectMenu, MessageSelectOptionData, VoiceChannel } from 'discord.js'

export default async function MarkCommand (interaction: CommandInteraction, _: any, db: DatabaseClient, locale: Locale, player: PlayerClient) {
  let selMenuSelection: MessageComponentInteraction | undefined
  const member = interaction.member as GuildMember

  function reply (options: InteractionReplyOptions) {
    if (selMenuSelection && selMenuSelection.replied) selMenuSelection.editReply(options)
    else if (selMenuSelection && !selMenuSelection.replied) selMenuSelection.reply(options)
    else if (interaction.replied) interaction.editReply(options)
    else interaction.reply(options)
  }

  if (!member.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ ephemeral: true, content: locale('mark_no_permission', member.displayName) })
  let targetChannel = interaction.options.getChannel('channel') || member.voice.channel

  if (!targetChannel) {
    const embed = new DefaultEmbed('mark', interaction.guild?.me?.roles.color, {
      title: locale('mark_select_voice')
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

    const selMenu = new MessageSelectMenu({ customId: `selMenu_${interaction.id}`, minValues: 1, maxValues: 1, options, placeholder: locale('mark_select_voice_placeholder') })
    interaction.reply({ embeds: [embed], components: [{ components: [selMenu], type: 1 }] })

    selMenuSelection = await interaction.channel?.awaitMessageComponent({ filter: (i: MessageComponentInteraction) => i.customId === `selMenu_${interaction.id}` && interaction.user.id === i.user.id })
    if (!selMenuSelection) return

    selMenu.setDisabled(true)
    interaction.editReply({ embeds: [embed], components: [{ components: [selMenu], type: 1 }] })

    const [channelId] = (selMenuSelection as unknown as RawMessageSelectMenuInteractionData).values
    targetChannel = interaction.guild?.channels.cache.get(channelId) as GuildChannel
  }

  if (!targetChannel || targetChannel.type !== 'GUILD_VOICE') return reply({ ephemeral: true, content: locale('mark_select_not_exist') })
  const targetVoiceChannel = targetChannel as VoiceChannel

  if (!targetVoiceChannel.joinable) return reply({ ephemeral: true, content: locale('mark_not_joinable') })
  if (!targetVoiceChannel.speakable) return reply({ ephemeral: true, content: locale('mark_not_speakable') })

  await db.markChannel(interaction.guild!, targetVoiceChannel)

  reply({ content: locale('mark_success', targetVoiceChannel.name, '/') })

  await player.clear()
  if (!interaction.guild?.me?.voice?.channel) {
    await player.play(targetVoiceChannel)
  }
}

export const metadata: ApplicationCommandData = {
  name: 'mark',
  description: 'you can set up a channel to play Lo-Fi all the time.',
  options: [{ name: 'channel', type: 'CHANNEL', description: 'a channel to mark' }]
}
