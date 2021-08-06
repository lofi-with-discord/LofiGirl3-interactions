import dotenv from 'dotenv'
import { del, get, post } from 'superagent'
import { VoiceChannel } from 'discord.js'

dotenv.config()

export default class PlayerClient {
  private endpoint: string
  private password: string

  constructor () {
    const host = process.env.CONTROL_HOST || 'localhost'
    const port = process.env.CONTROL_PORT

    this.endpoint = `http://${host}:${port}`
    this.password = process.env.CONTROL_PASSWORD!
  }

  public check = () =>
    get(`${this.endpoint}/`)
      .set('Authorization', this.password)

  public play = (channel: VoiceChannel) =>
    post(`${this.endpoint}/connection?channel=${channel.id}`)
      .set('Authorization', this.password)

  public stop = (channel: VoiceChannel) =>
    del(`${this.endpoint}/connection?channel=${channel.id}`)
      .set('Authorization', this.password)

  public clear = () =>
    del(`${this.endpoint}/cache`)
      .set('Authorization', this.password)
}
