import dotenv from 'dotenv'
import knex, { Knex } from 'knex'
import { Channel, Guild, User } from 'discord.js'
import { ThemeData, ChannelData, UserData } from '../types'

dotenv.config()

export default class DatabaseClient {
  private db: Knex

  constructor () {
    this.db = knex({
      client: 'mysql',
      connection: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: Number(process.env.DATABASE_PORT || 3306),
        user: process.env.DATABASE_USER || 'lofigirl',
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_SCHEMA || 'lofigirl'
      }
    })
  }

  public getUserData = async (user: User): Promise<UserData | undefined> =>
    (await this.db.select('*').from('users').where('id', user.id).limit(1))[0]

  public appendUserData = (data: UserData): Promise<void> =>
    this.db.insert(data).into('users')

  public updateUserData = (data: UserData): Promise<void> =>
    this.db.update(data).where('id', data.id).into('users')

  public getChannelData = async (channelOrGuild: Channel | Guild): Promise<ChannelData | undefined> =>
    (await this.db.select('*').from('channels')
      .where('id', channelOrGuild.id)
      .orWhere('guild', channelOrGuild.id).limit(1))[0]

  public async markChannel (guild: Guild, channel: Channel) {
    const hasAleady = await this.getChannelData(guild)
    if (hasAleady) return this.db.update({ id: channel.id }).where('guild', guild.id).from('channels')
    else return this.db.insert({ id: channel.id, guild: guild.id }).into('channels')
  }

  public unmarkChannel = (guild: Guild) =>
    this.db.delete().where('guild', guild.id).from('channels')

  public async changeTheme (guild: Guild, theme: number) {
    const hasAleady = await this.getChannelData(guild)
    if (hasAleady) return this.db.update({ theme }).where('guild', guild.id).from('channels')
    else return this.db.insert({ id: '0', guild: guild.id, theme }).from('channels')
  }

  public getThemeData = async (id: number): Promise<ThemeData | undefined> =>
    (await this.db.select('*').from('themes').where('id', id).limit(1))[0]

  public getAllThemeDatas = (): Promise<ThemeData[]> =>
    this.sortThemes(this.db.select('*').from('themes'))

  private async sortThemes (themes: Promise<ThemeData[]>) {
    const channels = await this.db.select('*').from('channels')

    return (await themes).sort((a, b) =>
      channels.filter((c) => c.theme === b.id).length - channels.filter((c) => c.theme === a.id).length
    )
  }
}
