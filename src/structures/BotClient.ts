import dotenv from 'dotenv'
import { Client, ClientEvents } from 'discord.js'

dotenv.config()

export default class BotClient extends Client {
  public koreanbots?: string

  constructor () {
    super({ intents: ['GUILDS', 'GUILD_VOICE_STATES'] })

    this.token = process.env.DISCORD_TOKEN!
    this.koreanbots = process.env.KOREANBOT_TOKEN
    this.login()
  }

  public registEvent = (event: keyof ClientEvents, func: Function, ...extra: any[]) =>
    this.on(event, (...args) => func(...args, ...extra))
}
