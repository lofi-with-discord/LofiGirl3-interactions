import { Locale } from '../types'
import registUser from '../functions/registUser'
import DatabaseClient from '../structures/DatabaseClient'
import { ApplicationCommandData, CommandInteraction } from 'discord.js'

export default async function LocaleCommand (interaction: CommandInteraction, _: any, db: DatabaseClient, locale: Locale) {
  await registUser(interaction, db, locale.i18n)
}

export const metadata: ApplicationCommandData = {
  name: 'locale',
  description: 'changes language settings'
}
