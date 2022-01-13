import { ButtonStyle, ExcludeEnum, Interaction, MessageButton, MessageComponentInteraction } from 'discord.js'

export function createButton (interaction: Interaction, emoji?: string, style?: ExcludeEnum<typeof ButtonStyle, 'Link'>, label?: string) {
  return new MessageButton({
    customId: interaction.id,
    emoji,
    label,
    style: style || 'Secondary'
  })
}

export function createLinkButton (url: string, emoji?: string, label?: string) {
  return new MessageButton({
    emoji,
    label,
    style: 'Link',
    url
  })
}

export async function resolveButton (interaction: Interaction) {
  const filter = (i: MessageComponentInteraction) =>
    i.customId === interaction.id && interaction.user.id === i.user.id

  const rawResponse = await interaction.channel?.awaitMessageComponent({ filter }).catch(() => {})
  if (!rawResponse) return undefined

  await rawResponse.update({}).catch(() => {})

  return rawResponse
}
