import { join } from 'path'
import { Client, ShardClientUtil } from 'discord.js'
import { deepCopy } from './utils'

export default class Constants {
  static readonly APP_NAME = 'Lofi Girl'

  static readonly EMBED_AUTHOR_NAME = // name
    (flag: string | undefined) => // arguments
      `${this.APP_NAME}${flag ? ` - ${flag}` : ''}` // result

  static readonly EMBED_AUTHOR_ICON =
    'https://cdn.discordapp.com/avatars/763033945767280650/69e2a6ad9703274d0f109a2b88f290af.webp'

  static readonly EMBED_COLOR = 0xdf73ff

  static readonly EMBED_THUMBNAIL =
    'https://media.discordapp.net/attachments/708927519973441556/763208406047129631/994BB93F5AD305BF02.png'

  static readonly COMPONENT_ARRAY = () =>
    deepCopy([{ components: [], type: 1 }])

  static readonly REGIST_USER_PLACEHOLDER =
    'Click me to select a language'

  static readonly REGIST_USER_TITLE =
    'Select a language'

  static readonly BOT_ACTIVITY =
    (listenerCount: number, shard: ShardClientUtil | null) =>
    `/help | with ${listenerCount} listeners ${shard ? 'on shard #' + shard.ids[0] : ''}`

  static readonly BOT_ACTIVITY_INTERVAL = 30000

  static readonly KOREANBOTS_GUILD_ENDPOINT =
    (client: Client) => `https://koreanbots.dev/api/v2/bots/${client.user?.id}/stats`

  static readonly YOUTUBE_SEARCH_PARAM = 'v'

  static readonly SUPPORT_SERVER_INVITE =
    'https://discord.gg/WJRtvankkB'

  static readonly HELP_IMAGE_URL =
    'https://i.ytimg.com/vi/5qap5aO4i9A/maxresdefault.jpg'

  static readonly HELP_IMAGE_DESCRIPTION =
    '* illustration by Juan Pablo Machado (http://jpmachado.art)'

  static readonly HELP_BOT_DESCRIPTION =
    ':radio: 24/7 radio player for discord\n' +
    '- developed by `Dev. PMH#7086`'

  static readonly HELP_TUTOR_IMAGE =
    'https://cdn.discordapp.com/attachments/530043751901429762/812601825568096287/Peek_2021-02-20_17-29.gif'

  static readonly INVITE_URL =
    (client: Client) =>
      `https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=0&scope=applications.commands%20bot`

  static readonly GITHUB_URL =
    'https://github.com/lofi-with-discord/LofiGirl3-playserver'

  static readonly KOREANBOTS_URL =
    'https://koreanbots.dev/bots/763033945767280650'

  static readonly TERMS_URL =
    'https://lofi.pmh.codes/#terms'

  static readonly COMMANDS_PATH =
    join(__dirname, 'commands')

  static readonly COMMAND_PATH =
    (commandFile: string) =>
      join(this.COMMANDS_PATH, commandFile)
}
