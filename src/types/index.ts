import { CommandData } from './data'
import I18nParser from '../classes/I18nParser'
import { ApplicationCommandData } from 'discord.js'

export * from './data'

type CommandFn = (data: CommandData) => void
export interface Command extends CommandFn {
  default: CommandFn
  metadata: ApplicationCommandData
}

export type LocaleFn = (phrase: string, ...args: any[]) => string
export interface Locale extends LocaleFn {
  i18n: I18nParser
}
