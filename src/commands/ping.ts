import { CommandData } from '../types'
import { DefaultEmbed } from '../utils'
import { ApplicationCommandData } from 'discord.js'
import { replyInteraction } from '../scripts/interactionReply'

export default function PingCommand ({ interaction, locale }: CommandData) {
  const embed = new DefaultEmbed('ping')
    .setTitle(locale('ping_success', interaction.client.ws.ping))

  replyInteraction(interaction, embed)
}

export const metadata: ApplicationCommandData = {
  name: 'ping',
  description: 'Measures and show us the speed of the communication delay.'
}
