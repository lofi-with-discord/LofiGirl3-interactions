/*
  # LofiGirl v3.
  This code is licensed under MIT license.
  (c) Lofi with Discord. All rights reserved.
*/

// Import Classes
import BotClient from './classes/BotClient'
import I18nParser from './classes/I18nParser'
import SlashHandler from './classes/SlashHandler'
import PlayerClient from './classes/PlayerClient'
import DatabaseClient from './classes/DatabaseClient'

// Import Event Handlers
import onReady from './events/onReady'
import onInteractionCreate from './events/onInteractionCreate'

// Initalize Classes
const i18n = new I18nParser()
const client = new BotClient()
const db = new DatabaseClient()
const slash = new SlashHandler()
const player = new PlayerClient()

// Regist Event Handlers
client.registEvent('ready', onReady, slash)
client.registEvent('interactionCreate', onInteractionCreate, slash, db, i18n, player)
