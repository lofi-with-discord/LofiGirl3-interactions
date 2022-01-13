import { CommandData } from '../types'
import { replyInteraction } from '../scripts/interactionReply'
import { createButton, resolveButton } from '../scripts/button'
import { ApplicationCommandData, GuildMember } from 'discord.js'

export default async function LeaveCommand ({ interaction, locale, player }: CommandData) {
  const member = interaction.member as GuildMember
  const meAt = interaction.guild?.me?.voice?.channel
  const userAt = member.voice.channel

  if (!meAt || !['GuildVoice', 'GuildStageVoice'].includes(meAt.type)) {
    replyInteraction(interaction, locale('leave_no_voice'))
    return
  }

  const movePerm = member.permissionsIn(meAt).has('MOVE_MEMBERS')
  const membersIn = meAt.members.filter((m) => !m.user.bot && m.id !== member.id).size
  const userIn = (!userAt || meAt.id !== userAt.id) ? 1 : 2

  if (membersIn < 1) {
    player.stop(meAt)
    replyInteraction(interaction, locale('leave_success'))
    return
  }

  if (!movePerm) {
    replyInteraction(interaction, locale('leave_force_fail_' + userIn, meAt.name))
    return
  }

  const forceBtn = createButton(interaction, '🔨', 'Danger')
  replyInteraction(interaction, locale('leave_force_question_' + userIn, meAt.name), forceBtn)

  const forceInteraction = await resolveButton(interaction)
  if (!forceInteraction) return

  replyInteraction(interaction, locale('leave_success'))

  player.stop(meAt)
}

export const metadata: ApplicationCommandData = {
  name: 'leave',
  description: 'stops the stream which is playing and leave the voice channel'
}
