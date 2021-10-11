import dotenv from 'dotenv'
import { Client, ClientEvents, Guild } from 'discord.js'

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

  private _voiceListenerCount (prev: number, curr: Guild) {
    const joined = curr.me?.voice?.channel
    if (!joined) return prev

    return prev + joined.members.filter((m) => !m.user.bot).size
  }

  public async voiceListenerCount () {
    if (!this.shard) {
      return this.guilds.cache
        .reduce(this._voiceListenerCount, 0)
    }

    return await this.shard.broadcastEval((client) =>
      client.guilds.cache.reduce(this._voiceListenerCount, 0))
      .then((results) => results.reduce((prev, curr) => prev + curr, 0))
  }

  public get totalMemberCount () {
    return this.guilds.cache
      .reduce((prev, curr) => prev + curr.memberCount, 0)
  }

  public async totalGuildCount () {
    if (!this.shard) return this.guilds.cache.size

    const guildSizes = await this.shard
      .fetchClientValues('guilds.cache.size') as number[]

    return guildSizes.reduce((prev, curr) => prev + curr, 0)
  }
}
