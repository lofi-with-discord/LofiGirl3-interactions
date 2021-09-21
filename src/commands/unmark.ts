import { CommandData } from '../types'
import { replyInteraction } from '../scripts/interactionReply'
import { ApplicationCommandData, GuildMember } from 'discord.js'

export default async function MarkCommand ({ interaction, db, locale, player }: CommandData) {
  const member = interaction.member as GuildMember

  if (!member.permissions.has('MANAGE_CHANNELS')) {
    replyInteraction(interaction, locale('unmark_no_permission', member.displayName))
    return
  }

  await db.unmarkChannel(interaction.guild!)
  await replyInteraction(interaction, locale('unmark_success', '/'))
  player.clear()
}

export const metadata: ApplicationCommandData = {
  name: 'unmark',
  description: 'unmark a channel.'
}
