import { CommandData } from '../types'
import registUser from '../scripts/registUser'
import { ApplicationCommandData } from 'discord.js'

export default function LocaleCommand ({ interaction, db, locale }: CommandData) {
  registUser(interaction, db, locale.i18n)
}

export const metadata: ApplicationCommandData = {
  name: 'locale',
  description: 'changes language settings'
}
