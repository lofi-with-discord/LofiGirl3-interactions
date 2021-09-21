import { Locale } from '../types'
import { Interaction } from 'discord.js'
import registUser from '../scripts/registUser'
import I18nParser from '../classes/I18nParser'
import SlashHandler from '../classes/SlashHandler'
import PlayerClient from '../classes/PlayerClient'
import DatabaseClient from '../classes/DatabaseClient'

export default async function onInteractionCreate (interaction: Interaction, slash: SlashHandler, db: DatabaseClient, i18n: I18nParser, player: PlayerClient) {
  if (!interaction.isCommand()) return
  if (!interaction.guild) {
    interaction.reply(i18n.__l('dm_disallow').join('\n'))
    return
  }

  await interaction.deferReply().catch(() => {})

  const userData = await db.getUserData(interaction.user)
  if (!userData) return await registUser(interaction, db, i18n, true)

  const locale: Locale = (phrase: string, ...args: any[]) =>
    i18n.__({ locale: userData?.locale, phrase }, ...args)

  locale.i18n = i18n
  slash.runCommand(interaction, db, locale, player)
}
