import { Interaction } from 'discord.js'
import I18nParser from '../structures/I18nParser'
import SlashHandler from '../structures/SlashHandler'
import DatabaseClient from '../structures/DatabaseClient'
import registUser from '../functions/registUser'
import { Locale } from '../types'
import PlayerClient from '../structures/PlayerClient'

export default async function onInteractionCreate (interaction: Interaction, slash: SlashHandler, db: DatabaseClient, i18n: I18nParser, player: PlayerClient) {
  if (!interaction.isCommand()) return
  if (!interaction.guild) return interaction.reply(i18n.__l('dm_disallow').join('\n'))

  const userData = await db.getUserData(interaction.user)
  if (!userData) return await registUser(interaction, db, i18n, true)

  const locale: Locale = (phrase: string, ...args: any[]) =>
    i18n.__({ locale: userData?.locale, phrase }, ...args)

  locale.i18n = i18n
  slash.runCommand(interaction, db, locale, player)
}
