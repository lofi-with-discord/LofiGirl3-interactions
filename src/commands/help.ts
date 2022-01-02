import _ from '../consts'

import { CommandData } from '../types'
import { DefaultEmbed } from '../utils'
import { replyInteraction } from '../scripts/interactionReply'
import { createButton, createLinkButton, resolveButton } from '../scripts/button'
import { ApplicationCommandData, EmbedField } from 'discord.js'

export default async function HelpCommand ({ interaction, locale, slash }: CommandData) {
  const embed = new DefaultEmbed(interaction)
    .setImage(_.HELP_IMAGE_URL)
    .setDescription(_.HELP_BOT_DESCRIPTION)
    .setFooter({ text: _.HELP_IMAGE_DESCRIPTION })

  const nextBtn = createButton(interaction, '➡️', 'SECONDARY')
  replyInteraction(interaction, embed, nextBtn)

  const nextInteraction = await resolveButton(interaction)
  if (!nextInteraction) return

  const fields = [] as EmbedField[]
  for (const command of slash.commands.keys()) {
    fields.push({
      name: `/${command}`,
      value: locale(`${command}_help`),
      inline: false
    })
  }

  const embed2 = new DefaultEmbed('help')
    .addFields(fields)
    .setImage(_.HELP_TUTOR_IMAGE)

  const termsBtn = createLinkButton(_.TERMS_URL, '❤️', locale('help_terms'))
  const githubBtn = createLinkButton(_.GITHUB_URL, '⭐', locale('help_github'))
  const inviteBtn = createLinkButton(_.INVITE_URL(interaction.client), '🎉', locale('help_invite'))
  const supportBtn = createLinkButton(_.SUPPORT_SERVER_INVITE, '💬', locale('help_support'))
  const koreanbotsBtn = createLinkButton(_.KOREANBOTS_URL, '❤️', locale('help_koreanbots'))

  interaction.editReply({
    embeds: [embed2],
    components: [
      { components: [inviteBtn, supportBtn, githubBtn, koreanbotsBtn], type: 1 },
      { components: [termsBtn], type: 1 }
    ]
  }).catch(console.log)
}

export const metadata: ApplicationCommandData = {
  name: 'help',
  description: 'show help'
}
