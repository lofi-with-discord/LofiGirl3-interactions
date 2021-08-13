import { Locale } from '../types'
import PlayerClient from '../structures/PlayerClient'
import DatabaseClient from '../structures/DatabaseClient'
import { ApplicationCommandData, CommandInteraction, GuildMember } from 'discord.js'

export default async function MarkCommand (interaction: CommandInteraction, _: any, db: DatabaseClient, locale: Locale, player: PlayerClient) {
  const member = interaction.member as GuildMember
  if (!member.permissions.has('MANAGE_CHANNELS')) return interaction.editReply({ content: locale('unmark_no_permission', member.displayName) })

  await db.unmarkChannel(interaction.guild!)

  interaction.editReply(locale('unmark_success', '/'))
  await player.clear()
}

export const metadata: ApplicationCommandData = {
  name: 'unmark',
  description: 'unmark a channel.'
}
