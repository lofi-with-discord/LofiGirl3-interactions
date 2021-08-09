import { Collection, Guild } from 'discord.js'
import dotenv from 'dotenv'
import { post } from 'superagent'
import BotClient from '../structures/BotClient'
import PlayerClient from '../structures/PlayerClient'
import SlashHandler from '../structures/SlashHandler'

dotenv.config()

export default async function onReady (client: BotClient, player: PlayerClient, slash: SlashHandler) {
  if (!client.user) return

  const playerAvailable = await player.check()

  if (playerAvailable.statusCode !== 200) {
    console.error('Unable to connect to the player API')
    process.exit(-1)
  }

  setInterval(async () => {
    const listenerCount = client.shard
      ? (await client.shard.fetchClientValues('guilds.cache') as Collection<string, Guild>[]).reduce((prev, curr) => prev + curr.reduce((prev, curr) => prev + (curr.me?.voice?.channel ? curr.me.voice.channel.members.filter((m) => !m.user.bot).size : 0), 0), 0)
      : client.guilds.cache.reduce((prev, curr) => prev + (curr.me?.voice?.channel ? curr.me.voice.channel.members.filter((m) => !m.user.bot).size : 0), 0)

    client.user?.setActivity(`/help | with ${listenerCount} listeners`)
  }, 5000)

  if (client.koreanbots) {
    setInterval(async () => {
      const servers = client.shard
        ? (await client.shard.fetchClientValues('guilds.cache.size') as number[]).reduce((prev: number, curr: number) => prev + curr, 0)
        : client.guilds.cache.size

      await post(`https://koreanbots.dev/api/v2/bots/${client.user?.id}/stats`)
        .set('Authorization', client.koreanbots!)
        .send({ servers })
    }, 60 * 1000)
  }

  if (process.env.REFRESH_SLASH_COMMAND_ON_READY) slash.registCachedCommands(client)

  console.log(`ready ${process.env.ENVIROMENT}`)
}
