import { CommandInteraction } from 'discord.js'

import { Locale } from '.'
import SlashHandler from '../classes/SlashHandler'
import PlayerClient from '../classes/PlayerClient'
import DatabaseClient from '../classes/DatabaseClient'

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

export interface CommandData {
  db: DatabaseClient
  slash: SlashHandler
  locale: Locale
  player: PlayerClient
  interaction: CommandInteraction
}
