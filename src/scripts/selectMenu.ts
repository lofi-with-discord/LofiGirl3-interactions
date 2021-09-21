import { RawMessageSelectMenuInteractionData } from 'discord.js/typings/rawDataTypes'
import { Interaction, MessageComponentInteraction, MessageSelectMenu, MessageSelectOptionData } from 'discord.js'

export function createSelectMenu (interaction: Interaction, options: MessageSelectOptionData[], placeholder: string | undefined) {
  return new MessageSelectMenu({
    customId: interaction.id,
    minValues: 1,
    maxValues: 1,
    placeholder,
    options
  })
}

export async function resolveMenuSelection (interaction: Interaction) {
  const filter = (i: MessageComponentInteraction) =>
    i.customId === interaction.id && interaction.user.id === i.user.id

  const rawResponse = await interaction.channel?.awaitMessageComponent({ filter })
  if (!rawResponse) return { success: false }

  await rawResponse.deferReply().catch(() => {})

  const response = rawResponse as unknown as RawMessageSelectMenuInteractionData
  return { success: true, interaction: rawResponse, result: response.values[0] }
}
