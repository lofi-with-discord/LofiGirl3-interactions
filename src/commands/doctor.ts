import { CommandData } from '../types'
import { ApplicationCommandData, GuildMember, PermissionString } from 'discord.js'
import { DefaultEmbed } from '../utils'

export default async function Doctorommand ({ interaction, locale }: CommandData) {
  const member = interaction.member as GuildMember
  const clientMember = interaction.guild?.me as GuildMember

  const channel = member.voice.channel

  if (!channel) return interaction.editReply(locale('doctor_no_voice'))

  const permissions = channel.permissionsFor(clientMember)
  const isStage = channel.type === 'GUILD_STAGE_VOICE'

  const requirePerms: PermissionString[] =
    isStage
      ? ['VIEW_CHANNEL', 'CONNECT', 'MUTE_MEMBERS']
      : ['VIEW_CHANNEL', 'CONNECT', 'SPEAK']

  const optionalPerms: PermissionString[] =
    ['MANAGE_CHANNELS', 'MOVE_MEMBERS']

  const permChecker = (prev: string, curr: PermissionString) =>
    `${prev}${locale(`perms_${curr}`)}: ${permissions.has(curr) ? '✅' : '❌'}\n`

  const embed = new DefaultEmbed(interaction)
    .addField('REQUIRE', requirePerms.reduce(permChecker, ''))

  if (isStage) embed.addField('OPTIONS', optionalPerms.reduce(permChecker, ''))

  interaction.editReply({ embeds: [embed] })
}

export const metadata: ApplicationCommandData = {
  name: 'doctor',
  description: 'Verify that the bot has been granted sufficient privileges.'
}
