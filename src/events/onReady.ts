import dotenv from 'dotenv'
import { post } from 'superagent'
import BotClient from '../structures/BotClient'
import PlayerClient from '../structures/PlayerClient'
import SlashHandler from '../structures/SlashHandler'

dotenv.config()

export default async function onReady (client: BotClient, player: PlayerClient, slash: SlashHandler) {
  if (!client.user) return

  await player.check()

  setInterval(async () => {
    const listenerCount = client.guilds.cache.reduce((prev, curr) => prev + (curr.me?.voice?.channel ? curr.me.voice.channel.members.filter((m) => !m.user.bot).size : 0), 0)

    client.user?.setActivity(`/help | with ${listenerCount} listeners ${client.shard ? 'on shard #' + client.shard.ids[0] : ''}`)
  }, 30000)

  if (client.koreanbots) {
    setInterval(async () => {
      const servers = client.shard
        ? (await client.shard.fetchClientValues('guilds.cache.size') as number[]).reduce((prev: number, curr: number) => prev + curr, 0)
        : client.guilds.cache.size

      await post(`https://koreanbots.dev/api/v2/bots/${client.user?.id}/stats`)
        .set('Authorization', client.koreanbots!)
        .send({ servers }).catch(() => {})
    }, 60 * 1000)
  }

  if (process.env.REFRESH_SLASH_COMMAND_ON_READY === 'true') slash.registCachedCommands(client)

  console.log(`ready ${process.env.ENVIROMENT}`)
}
