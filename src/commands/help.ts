import { Locale } from '../types'
import { DefaultEmbed } from '../utils'
import SlashHandler from '../structures/SlashHandler'
import { ApplicationCommandData, CommandInteraction, EmbedField, MessageButton } from 'discord.js'

export default async function HelpCommand (interaction: CommandInteraction, slash: SlashHandler, _: any, locale: Locale) {
  const embed = new DefaultEmbed('', interaction.guild?.me?.roles.color, {
    description: ':radio: 24/7 radio player for discord\n- developed by `Dev. PMH#7086`'
  }).setImage('https://i.ytimg.com/vi/5qap5aO4i9A/maxresdefault.jpg')
    .setFooter('* illustration by Juan Pablo Machado (http://jpmachado.art)')

  const nextBtn = new MessageButton({ customId: `next_${interaction.id}`, emoji: '➡️', style: 'SECONDARY' })

  interaction.reply({ embeds: [embed], components: [{ components: [nextBtn], type: 1 }] })
  const nextInteraction = await interaction.channel?.awaitMessageComponent({ filter: (i) => i.customId === `next_${interaction.id}` && i.user.id === interaction.user.id })
  if (!nextInteraction) return

  const fields = [] as EmbedField[]
  for (const command of slash.commands.keys()) {
    fields.push({ name: `/${command}`, value: locale(`${command}_help`), inline: false })
  }

  const embed2 = new DefaultEmbed('help', interaction.guild?.me?.roles.color)
    .addFields(fields)
    .setImage('https://cdn.discordapp.com/attachments/530043751901429762/812601825568096287/Peek_2021-02-20_17-29.gif')

  const url = `https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user?.id}&permissions=0&scope=applications.commands%20bot`
  const inviteBtn = new MessageButton({ emoji: '🎉', label: locale('help_invite'), url, style: 'LINK' })
  const supportBtn = new MessageButton({ emoji: '💬', label: locale('help_support'), url: 'https://discord.com/invite/WJRtvankkB', style: 'LINK' })
  const githubBtn = new MessageButton({ emoji: '⭐', label: locale('help_github'), url: 'https://github.com/lofi-with-discord/LofiGirl3-playserver', style: 'LINK' })
  const koreanbotsBtn = new MessageButton({ emoji: '❤️', label: locale('help_koreanbots'), url: 'https://koreanbots.dev/bots/763033945767280650', style: 'LINK' })

  nextInteraction.update({})
  interaction.editReply({ embeds: [embed2], components: [{ components: [inviteBtn, supportBtn, githubBtn, koreanbotsBtn], type: 1 }] })
}

export const metadata: ApplicationCommandData = {
  name: 'help',
  description: 'show help'
}
