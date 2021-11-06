import { Interaction, MessageButton, MessageComponentInteraction } from 'discord.js'

export function createButton (interaction: Interaction, emoji?: string, style?: any, label?: string) {
  return new MessageButton({
    customId: interaction.id,
    emoji,
    label,
    style
  })
}

export function createLinkButton (url: string, emoji?: string, label?: string) {
  return new MessageButton({
    emoji,
    label,
    style: 'LINK',
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
