import _ from '../consts'

import { CommandData } from '../types'
import { DefaultEmbed, getYtInfo } from '../utils'
import { replyInteraction } from '../scripts/interactionReply'
import { createButton, resolveButton } from '../scripts/button'
import { createSelectMenu, resolveMenuSelection } from '../scripts/selectMenu'
import { ApplicationCommandData, GuildMember, MessageSelectOptionData } from 'discord.js'

export default async function ThemeCommand ({ interaction, db, locale, player }: CommandData) {
  const member = interaction.member as GuildMember

  const themes = await db.getAllThemeDatas()

  const embed = new DefaultEmbed(interaction)
    .setTitle(locale('theme_found', themes.length))
    .setDescription(locale('theme_submit', _.SUPPORT_SERVER_INVITE))

  const options = [] as MessageSelectOptionData[]
  for (const themeIndex in themes) {
    const theme = themes[themeIndex]

    options.push({
      label: theme.name,
      value: String(theme.id),
      description: theme.url,
      emoji: ['🥇', '🥈', '🥉'][themeIndex] || '💿',
      default: false
    })
  }

  const selMenu = createSelectMenu(interaction, options, locale('play_select_voice_placeholder'))
  await replyInteraction(interaction, embed, selMenu)

  const res = await resolveMenuSelection(interaction)
  if (!res.success) return

  selMenu.setDisabled(true)
  replyInteraction(interaction, embed, selMenu)

  const chosenTheme = await db.getThemeData(parseInt(res.result!))

  if (!chosenTheme) return
  replyInteraction(res.interaction!, locale('theme_success', chosenTheme.name))

  const userAt = member.voice.channel
  const meAt = interaction.guild?.me?.voice?.channel

  await db.changeTheme(interaction.guild!, chosenTheme.id)
  player.clear()

  if (!userAt || userAt.type !== 'GuildVoice') return

  if (meAt) {
    const membersIn = meAt.members.filter((m) => !m.user.bot && m.id !== interaction.user.id).size
    const movePerm = member.permissions.has('MOVE_MEMBERS')

    if (membersIn > 1) {
      if (!movePerm) return replyInteraction(res.interaction!, locale('theme_play_force_fail', meAt.name))

      const forceBtn = createButton(interaction, '🔨', 'Danger')
      replyInteraction(res.interaction!, locale('theme_play_force_question', meAt.name), forceBtn)

      res.interaction = await resolveButton(res.interaction!)
      if (!res.interaction) return
    }
  }

  const channelData = await db.getChannelData(interaction.guild!)

  const themeNo = channelData?.theme || 1
  const themeData = await db.getThemeData(themeNo)

  if (!themeData) return replyInteraction(res.interaction!, locale('theme_play_theme_fail', '/'))

  player.play(userAt)
  const data = await getYtInfo(themeData.url)

  const embed2 = new DefaultEmbed(interaction)
    .setTitle(data.title)
    .setImage(data.image)
    .setFooter({ text: locale('theme_play_detail_footer', '/') })
    .setDescription(locale('theme_play_detail', data.author.name, data.url))

  replyInteraction(res.interaction!, embed2)
}

export const metadata: ApplicationCommandData = {
  name: 'theme',
  description: 'you can change the Lo-Fi theme I\'m going to play'
}
