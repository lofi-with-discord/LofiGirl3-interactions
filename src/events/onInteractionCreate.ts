import { Locale } from '../types'
import { Interaction } from 'discord.js'
import I18nParser from '../classes/I18nParser'
import SlashHandler from '../classes/SlashHandler'
import PlayerClient from '../classes/PlayerClient'
import DatabaseClient from '../classes/DatabaseClient'

export default async function onInteractionCreate (interaction: Interaction, slash: SlashHandler, db: DatabaseClient, i18n: I18nParser, player: PlayerClient) {
  if (!interaction.isCommand()) return

  const locale: Locale = (phrase: string, ...args: any[]) =>
    i18n.__({
      phrase,
      locale: i18n.getLocales()
        .includes(interaction.locale)
        ? interaction.locale
        : 'en-US'
    }, ...args)

  if (!interaction.guild) {
    interaction.reply(locale('dm_disallow'))
    return
  }

  await interaction.deferReply().catch(() => {})

  locale.i18n = i18n
  slash.runCommand(interaction, db, locale, player)
}
