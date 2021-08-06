import onReady from './events/onReady'
import BotClient from './structures/BotClient'
import I18nParser from './structures/I18nParser'
import SlashHandler from './structures/SlashHandler'
import PlayerClient from './structures/PlayerClient'
import DatabaseClient from './structures/DatabaseClient'
import onInteractionCreate from './events/onInteractionCreate'

const i18n = new I18nParser()
const client = new BotClient()
const db = new DatabaseClient()
const slash = new SlashHandler()
const player = new PlayerClient()

client.registEvent('ready', onReady, player, slash)
client.registEvent('interactionCreate', onInteractionCreate, slash, db, i18n, player)
