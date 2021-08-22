import { Locale } from '../types'
import { DefaultEmbed } from '../utils'
import { ApplicationCommandData, CommandInteraction } from 'discord.js'

export default async function PingCommand (interaction: CommandInteraction, _: any, __: any, locale: Locale) {
  const embed = new DefaultEmbed('ping', interaction.guild?.me?.roles.color, {
    title: locale('ping_success', interaction.client.ws.ping)
  })

  interaction.editReply({ embeds: [embed] }).catch(() => {})
}

export const metadata: ApplicationCommandData = {
  name: 'ping',
  description: 'Measures and show us the speed of the communication delay.'
}
