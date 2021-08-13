import dotenv from 'dotenv'
import { del, get, post } from 'superagent'
import { VoiceChannel } from 'discord.js'

dotenv.config()

export default class PlayerClient {
  private endpoints: string[]
  private password: string

  constructor () {
    const host = process.env.CONTROL_HOST || 'localhost'
    const port = process.env.CONTROL_PORT

    this.endpoints = port?.split(',').reduce((prev, curr) => [...prev, `http://${host}:${curr}`], [] as string[])!
    this.password = process.env.CONTROL_PASSWORD!
  }

  public check = () =>
    this.endpoints.forEach(async (endpoint) =>
      await get(`${endpoint}/`)
        .set('Authorization', this.password))

  public play = (channel: VoiceChannel) =>
    this.endpoints.forEach(async (endpoint) =>
      await post(`${endpoint}/connection?channel=${channel.id}`)
        .set('Authorization', this.password))

  public stop = (channel: VoiceChannel) =>
    this.endpoints.forEach(async (endpoint) =>
      await del(`${endpoint}/connection?channel=${channel.id}`)
        .set('Authorization', this.password))

  public clear = () =>
    this.endpoints.forEach(async (endpoint) =>
      await del(`${endpoint}/cache`)
        .set('Authorization', this.password))
}
