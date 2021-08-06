import I18nParser from './structures/I18nParser'
import SlashHandler from './structures/SlashHandler'
import DatabaseClient from './structures/DatabaseClient'
import { ApplicationCommandData, CommandInteraction } from 'discord.js'
import PlayerClient from './structures/PlayerClient'

export type LocaleFn = (phrase: string, ...args: any[]) => string
export interface Locale extends LocaleFn {
  i18n: I18nParser
}

export interface UserData {
  id: string
  locale: string
}

export interface ChannelData {
  id: string
  guild: string
  theme: number
}

export interface ThemeData {
  id: number
  name: string
  url: string
}

type CommandFn = (interaction: CommandInteraction, slash: SlashHandler, db: DatabaseClient, locale: Locale, player: PlayerClient) => void
export interface Command extends CommandFn {
  default: CommandFn
  metadata: ApplicationCommandData
}
