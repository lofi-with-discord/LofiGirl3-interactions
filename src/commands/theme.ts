import { Locale } from '../types'
import { DefaultEmbed, getYtInfo } from '../utils'
import PlayerClient from '../structures/PlayerClient'
import DatabaseClient from '../structures/DatabaseClient'
import { RawMessageSelectMenuInteractionData } from 'discord.js/typings/rawDataTypes'
import { ApplicationCommandData, CommandInteraction, GuildMember, InteractionReplyOptions, MessageButton, MessageComponentInteraction, MessageSelectMenu, MessageSelectOptionData } from 'discord.js'

export default async function ThemeCommand (interaction: CommandInteraction, _: any, db: DatabaseClient, locale: Locale, player: PlayerClient) {
  let nextInteraction: MessageComponentInteraction | undefined
  const member = interaction.member as GuildMember

  function reply (options: InteractionReplyOptions) {
    if (nextInteraction) nextInteraction.editReply(options).catch(() => {})
    else interaction.editReply(options).catch(() => {})
  }

  const themes = await db.getAllThemeDatas()

  const embed = new DefaultEmbed('theme', interaction.guild?.me?.roles?.color, {
    title: locale('theme_found', themes.length),
    description: locale('theme_submit', 'https://discord.gg/WJRtvankkB')
  })

  const options = [] as MessageSelectOptionData[]
  for (const theme of themes) {
    options.push({
      label: theme.name,
      value: String(theme.id),
      description: theme.url,
      emoji: '💿',
      default: false
    })
  }

  const selMenu = new MessageSelectMenu({ customId: `selMenu_${interaction.id}`, minValues: 1, maxValues: 1, options, placeholder: locale('play_select_voice_placeholder') })
  interaction.editReply({ embeds: [embed], components: [{ components: [selMenu], type: 1 }] }).catch(() => {})

  nextInteraction = await interaction.channel?.awaitMessageComponent({ filter: (i: MessageComponentInteraction) => i.customId === `selMenu_${interaction.id}` && interaction.user.id === i.user.id })
  if (!nextInteraction) return

  await nextInteraction.deferReply().catch(() => {})

  selMenu.setDisabled(true)
  interaction.editReply({ embeds: [embed], components: [{ components: [selMenu], type: 1 }] }).catch(() => {})

  const [themeId] = (nextInteraction as unknown as RawMessageSelectMenuInteractionData).values
  const chosenTheme = await db.getThemeData(parseInt(themeId))

  if (!chosenTheme) return
  reply({ content: locale('theme_success', chosenTheme.name) })

  await db.changeTheme(interaction.guild!, chosenTheme.id)
  await player.clear()

  const userAt = member.voice.channel
  const meAt = interaction.guild?.me?.voice?.channel

  if (!userAt || userAt.type !== 'GUILD_VOICE') return

  if (meAt) {
    const membersIn = meAt.members.filter((m) => !m.user.bot && m.id !== interaction.user.id).size
    const movePerm = member.permissions.has('MOVE_MEMBERS')

    if (membersIn > 1) {
      if (!movePerm) return reply({ ephemeral: true, content: locale('theme_play_force_fail', meAt.name) })

      const forceBtn = new MessageButton({ customId: `forceBtn_${interaction.id}`, emoji: '🔨', style: 'DANGER' })
      reply({ content: locale('theme_play_force_question', meAt.name), components: [{ components: [forceBtn], type: 1 }] })

      const forceInteraction = await interaction.channel?.awaitMessageComponent({ filter: (i) => i.customId === `forceBtn_${interaction.id}` && i.user.id === interaction.user.id })
      if (!forceInteraction) return

      await forceInteraction.deferReply().catch(() => {})

      nextInteraction = forceInteraction
    }
  }

  const channelData = await db.getChannelData(interaction.guild!)

  const themeNo = channelData?.theme || 1
  const themeData = await db.getThemeData(themeNo)

  if (!themeData) return reply({ ephemeral: true, content: locale('theme_play_theme_fail', '/') })
  await player.play(userAt)

  const data = await getYtInfo(themeData.url)

  const embed2 = new DefaultEmbed('theme', interaction.guild?.me?.roles.color, {
    title: data.title,
    description: locale('theme_play_detail', data.author.name, data.url)
  }).setImage(data.image)
    .setFooter(locale('theme_play_detail_footer', '/'))

  reply({ embeds: [embed2] })
}

export const metadata: ApplicationCommandData = {
  name: 'theme',
  description: 'you can change the Lo-Fi theme I\'m going to play'
}
