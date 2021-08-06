import path from 'path'
import dotenv from 'dotenv'
import { readdirSync } from 'fs'
import BotClient from './BotClient'
import { Command, Locale } from '../types'
import DatabaseClient from './DatabaseClient'
import { ApplicationCommandData, CommandInteraction } from 'discord.js'
import PlayerClient from './PlayerClient'

dotenv.config()

export default class SlashHandler {
  public commands: Map<string, Command>

  constructor () {
    this.commands = new Map()

    const commandPath = path.join(__dirname, '..', 'commands')
    const commandFiles = readdirSync(commandPath)

    for (const commandFile of commandFiles) {
      const commandName = commandFile.split('.').slice(0, -1).join('.')

      this.commands.set(commandName, require(path.join(commandPath, commandFile)))
    }
  }

  public runCommand (interaction: CommandInteraction, db: DatabaseClient, locale: Locale, player: PlayerClient) {
    const commandName = interaction.commandName
    const command = this.commands.get(commandName)

    if (!command) return
    command.default(interaction, this, db, locale, player)
  }

  public async registCachedCommands (client: BotClient): Promise<void> {
    if (!client.application) return console.warn('WARNING: registCachedCommands() called before application is ready.')

    const metadatas = [] as ApplicationCommandData[]
    for (const command of this.commands.values()) {
      metadatas.push(command.metadata)
    }

    if (process.env.ENVIROMENT?.toUpperCase() === 'DEV') {
      await client.application.commands.set([], process.env.ENVIROMENT_DEV_GUILD!)
      await client.application.commands.set(metadatas, process.env.ENVIROMENT_DEV_GUILD!)

      console.log('Registered commands for guild:', process.env.ENVIROMENT_DEV_GUILD!)
      return
    }

    await client.application.commands.set([])
    await client.application.commands.set(metadatas)
    console.log('Registered commands.')
  }
}
