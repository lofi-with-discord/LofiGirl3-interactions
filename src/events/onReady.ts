import _ from '../consts'

import { post } from 'superagent'
import BotClient from '../classes/BotClient'
import SlashHandler from '../classes/SlashHandler'

export default async function onReady (client: BotClient, slash: SlashHandler) {
  if (!client.user) return

  const sendStatus = () =>
    client.user?.setActivity(_.BOT_ACTIVITY(client.voiceListenerCount, client.shard))

  setInterval(sendStatus, _.BOT_ACTIVITY_INTERVAL)

  if (client.koreanbots) {
    setInterval(async () => {
      const servers = client.totalGuildCount()

      await post(_.KOREANBOTS_GUILD_ENDPOINT(client))
        .set('Authorization', client.koreanbots!)
        .send({ servers }).catch(() => {})
    }, 60 * 1000)
  }

  console.log(`ready ${process.env.ENVIROMENT}`)
  console.log(`for debug: there are ${client.totalMemberCount} members in shard`)

  if (process.env.REFRESH_SLASH_COMMAND_ON_READY !== 'true') return

  await slash.registCachedCommands(client)
}
