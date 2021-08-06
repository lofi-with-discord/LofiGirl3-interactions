import { DefaultEmbed } from '../utils'
import I18nParser from '../structures/I18nParser'
import DatabaseClient from '../structures/DatabaseClient'
import { RawMessageSelectMenuInteractionData } from 'discord.js/typings/rawDataTypes'
import { CommandInteraction, MessageComponentInteraction, MessageSelectMenu, MessageSelectOptionData } from 'discord.js'

export default async function registUser (interaction: CommandInteraction, db: DatabaseClient, i18n: I18nParser, isFirstCall = false) {
  const flags = i18n.__l('flag')
  const locales = i18n.__l('locale')
  const localeIds = i18n.getLocales()
  const translaters = i18n.__l('translaters')

  const options = [] as MessageSelectOptionData[]

  for (const index in flags) {
    options.push({
      emoji: flags[index],
      label: locales[index],
      value: localeIds[index],
      description: translaters[index],
      default: false
    })
  }

  const selectMenu = new MessageSelectMenu({ customId: `locale_selection_${interaction.id}`, minValues: 1, maxValues: 1, options, placeholder: 'Click me to select a language' })
  const embed = new DefaultEmbed('oobe', null, { title: 'Select a language' })

  await interaction.reply({ embeds: [embed], components: [{ components: [selectMenu], type: 1 }] })
  const localeSelection = await interaction.channel?.awaitMessageComponent({ filter: (i: MessageComponentInteraction) => i.customId === `locale_selection_${interaction.id}` && interaction.user.id === i.user.id })
  if (!localeSelection) return { id: interaction.user.id, locale: '' }

  const [locale] = (localeSelection as unknown as RawMessageSelectMenuInteractionData).values
  const data = { id: interaction.user.id, locale }

  selectMenu.setDisabled(true)
  selectMenu.options = [{ emoji: { id: null, name: '👌' }, label: i18n.__({ locale, phrase: 'locale_success' }), value: 'confirm', description: '', default: true }]

  await interaction.editReply({ embeds: [embed], components: [{ components: [selectMenu], type: 1 }] })

  const user = await db.getUserData(interaction.user)
  if (!user) await db.appendUserData(data)
  else await db.updateUserData(data)

  if (isFirstCall) localeSelection.reply({ ephemeral: true, content: i18n.__({ locale, phrase: 'locale_success_msg' }) })
  else localeSelection.update({}).catch(() => {})

  return data
}
