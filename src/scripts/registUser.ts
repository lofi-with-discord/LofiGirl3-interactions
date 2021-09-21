import _ from '../consts'

import { DefaultEmbed } from '../utils'
import I18nParser from '../classes/I18nParser'
import { replyInteraction } from './interactionReply'
import DatabaseClient from '../classes/DatabaseClient'
import { resolveMenuSelection, createSelectMenu } from './selectMenu'
import { CommandInteraction, MessageSelectOptionData } from 'discord.js'

export default async function registUser (interaction: CommandInteraction, db: DatabaseClient, i18n: I18nParser, isFirstCall = false) {
  const flags = i18n.__l('flag')
  const locales = i18n.__l('locale')
  const localeIds = i18n.getLocales()
  const translaters = i18n.__l('translaters')

  const options = [] as MessageSelectOptionData[]

  for (const flagIndex in flags) {
    options.push({
      emoji: flags[flagIndex],
      label: locales[flagIndex],
      value: localeIds[flagIndex],
      description: translaters[flagIndex],
      default: false
    })
  }

  const embed = new DefaultEmbed('oobe')
    .setTitle(_.REGIST_USER_TITLE)

  const selectMenu = createSelectMenu(interaction, options, _.REGIST_USER_PLACEHOLDER)

  await replyInteraction(interaction, embed, selectMenu)

  const res = await resolveMenuSelection(interaction)
  if (!res.success) return { id: interaction.user.id, locale: '' }

  const localeFn = (phrase: string) => i18n.__({ phrase, locale: res.result! })

  selectMenu.setDisabled(true)
  selectMenu.options = [{
    emoji: { id: null, name: '👌' },
    label: localeFn('locale_success'),
    value: 'confirm',
    description: '',
    default: true
  }]

  await replyInteraction(interaction, embed, selectMenu)

  const data = { id: interaction.user.id, locale: res.result! }

  const user = await db.getUserData(interaction.user)
  if (!user) await db.appendUserData(data)
  else await db.updateUserData(data)

  const phrase = isFirstCall ? 'locale_success_msg' : 'locale_success'
  replyInteraction(res.interaction!, localeFn(phrase))

  return data
}
